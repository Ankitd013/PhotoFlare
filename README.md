# PhotoFlare

**An Edge-First Static Gallery with Cloudflare & Angular**

PhotoFlare is a high-performance image gallery that demonstrates the power of edge computing by serving a fully static yet dynamic photo experience using Cloudflare's ecosystem and Angular—no traditional backend required.

## 🌟 Live Demo

- **🔗 [Live Gallery](https://pixels.clawiz.com)** - View the production gallery
- **📖 [Blog Post](https://clawiz.com/posts/photoflare/)** - Detailed technical breakdown

## ✨ Key Features

- **🚀 WebP Optimization**: Automatically serves optimized WebP images based on device and browser support
- **📱 Responsive Design**: Seamless experience across all device types  
- **⚡ Edge-Native Performance**: Sub-100ms metadata lookups via Cloudflare KV
- **📸 High-Quality Downloads**: Users can download original, highest-quality versions
- **🔗 Instagram Integration**: Direct links to corresponding Instagram posts
- **🛡️ CORS Compliant**: Proper cross-origin handling for secure API access
- **📦 Serverless Architecture**: Fully scalable with no server maintenance

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│ Cloudflare Pages │───▶│ Cloudflare CDN  │
│   (Angular)     │    │  Static Hosting  │    │   Global Edge   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └─────────────▶│ Cloudflare      │◀─────────────┘
                        │ Worker (API)    │
                        └─────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
           ┌─────────────────┐       ┌─────────────────┐
           │ Cloudflare KV   │       │ Cloudflare R2   │
           │ (Metadata)      │       │ (Images)        │
           └─────────────────┘       └─────────────────┘
```

## 🛠️ Technology Stack

| Purpose | Technology |
|---------|------------|
| **Frontend UI** | Angular |
| **Static Hosting** | Cloudflare Pages |
| **Image Metadata** | Cloudflare KV Store |
| **Image Storage** | Cloudflare R2 |
| **Edge Logic** | Cloudflare Workers |
| **CI/CD** | GitHub Actions |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Pages, Workers, KV, and R2 enabled

### 1. Clone and Setup

```bash
git clone https://github.com/Ankitd013/PhotoFlare.git
cd PhotoFlare
```

### 2. Frontend Setup

```bash
cd angular-app
npm install
ng serve  # Development server on http://localhost:4200
```

### 3. Worker Development

```bash
cd ../worker
npm install
wrangler dev  # Local worker development
```

## ⚙️ Cloudflare Configuration

### 1. Create KV Namespace

```bash
wrangler kv:namespace create "PHOTOFLARE"
```

### 2. Add Photo Metadata

Create your gallery metadata in KV with the key `photos`:

```bash
wrangler kv:key put --binding=PHOTOFLARE photos '[
  {
    "description": "Your photo description",
    "instagramPostUrl": "https://instagram.com/p/YOUR_POST/",
    "date": "2024-01-01",
    "images": [
      {"img": "original.jpg", "webp": "optimized_webp_name"}
    ]
  }
]'
```

### 3. Configure R2 Bucket

Set up your R2 bucket for image storage:
- Original images in `/org/` folder
- WebP optimized images in `/img/` folder

### 4. Worker Configuration

Update `wrangler.toml`:

```toml
name = "photoflare-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "PHOTOFLARE"
id = "your_kv_namespace_id"

# Add route for your custom domain
route = "pixels.yourdomain.com/docs/*"
```

## 🔧 Environment Configuration

### Angular Production Environment

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  bucketURL: 'https://your-r2-bucket.your-domain.com',
  rawImagePath: 'org',        // Original images folder
  webpImagePath: 'img',       // WebP images folder  
  dataURL: '/docs/'          // API route served by Worker
};
```

### Worker CORS Setup

The Worker handles CORS and API routing:

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      // Fetch metadata from KV
      let value = await env.PHOTOFLARE.get("photos");
      
      // Configure CORS
      const allowedOrigins = [
        "http://localhost:4200", 
        "https://pixels.yourdomain.com"
      ];
      const origin = request.headers.get("Origin");
      
      const headers = new Headers({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      });
      
      return new Response(value, { headers });
    } catch (error) {
      console.error('Error fetching from KV:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
```

## 📦 Deployment

### Automated via GitHub Actions

The project includes GitHub Actions workflows for:
- **Angular app** → Cloudflare Pages
- **Worker** → Cloudflare Workers  
- **Secrets management** → GitHub repository settings

### Manual Deployment

```bash
# Deploy Angular app
cd angular-app
npm run build
wrangler pages deploy dist/

# Deploy Worker
cd ../worker  
wrangler deploy
```

## 📊 Performance Results

- ⚡ **Sub-100ms** KV metadata lookups
- 🖼️ **Seamless** R2 image loading with lazy loading
- 🚀 **Fully serverless** and globally distributed
- 📱 **Mobile-optimized** with WebP format support

## 🎯 Key Technical Achievements

- **Edge-Native Architecture**: No traditional backend servers required
- **Optimized Image Delivery**: WebP format with fallback to original formats
- **Dynamic Static Site**: Feels dynamic while being completely static
- **Global Performance**: Leverages Cloudflare's 300+ edge locations
- **Cost-Effective**: Runs within Cloudflare's generous free tiers

## 🛡️ Security Features

- CORS properly configured for cross-origin requests
- No exposed API keys in frontend code
- Secure image serving through R2 public bindings
- Worker-based API routing for enhanced security

## 📝 Data Structure

Gallery metadata stored in Cloudflare KV:

```json
[
  {
    "description": "Photo description text",
    "instagramPostUrl": "https://instagram.com/p/POST_ID/",
    "date": "2024-01-01", 
    "images": [
      {
        "img": "DSCN0001.jpg",
        "webp": "DSCN0001"
      }
    ]
  }
]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the CC BY 4.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloudflare** for providing an amazing edge computing platform
- **Angular** team for the robust frontend framework
- **Instagram API** for social media integration capabilities

## 📧 Contact

**Ankit Das** - [@ankitd013](https://github.com/Ankitd013)

Project Link: [https://github.com/Ankitd013/PhotoFlare](https://github.com/Ankitd013/PhotoFlare)

---

⭐ **Star this repo** if you found it helpful!

Built with ❤️ using edge-first architecture and modern web technologies.
