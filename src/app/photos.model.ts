// photo.model.ts

export interface Photo {
    description: string;
    instagramPostUrl: string;
    date: Date;
    images: Image[];
  }
  
  export interface Image {
    img: string;
    webp: string;
  }
  