import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, ActionSheetController, Platform, ToastController,
  IonCard, IonRow, IonGrid, IonCol, IonCardHeader, IonCardTitle, IonNote,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCardSubtitle
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { SplashPageComponent } from '../splash-page/splash-page.component';
import { Title, Meta} from '@angular/platform-browser';
import { Share } from '@capacitor/share';
import { ClipboardService } from 'ngx-clipboard';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SwiperDirective } from '../swiper.directive';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Photo } from '../photos.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, SplashPageComponent, IonCard, IonRow, IonGrid, IonCol, IonCardHeader, IonCardTitle, IonNote,
    IonInfiniteScroll, IonInfiniteScrollContent, IonCardSubtitle, NgOptimizedImage, SwiperDirective],
})
export class GalleryComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  imageSize: string;
  isViewInitialized = false;
  index = 0;
  imageLoaded: boolean[] = [];
  photos:Photo[]=[]
  //   photos:Photo[] = [
  //   {
  //     description: 'Immersing in centuries-old craftsmanship that echoes Indias cultural tapestry. Every angle tells a tale, each stone holds historys secrets.', instagramPostUrl: 'https://www.instagram.com/p/C0w4jroor4K/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-12-13'),
  //     images: [{ img: 'assets/org/DSCN0803.jpg', webp: 'assets/img/DSCN0803' }, { img: 'assets/org/DSCN0805.jpg', webp: 'assets/img/DSCN0805' }, { img: 'assets/org/DSCN0809.jpg', webp: 'assets/img/DSCN0809' }]
  //   },
  //   {
  //     description: 'Timeless beauty in brick and mortar: Captured the Firoz Minar, its intricate details and towering height a testament to history grandeur.', instagramPostUrl: 'https://www.instagram.com/p/C0uUZhKSv6m/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-12-12'),
  //     images: [{ img: 'assets/org/DSCN0814.jpg', webp: 'assets/img/DSCN0814' }, { img: 'assets/org/DSCN0816.jpg', webp: 'assets/img/DSCN0816' }]
  //   },
  //   {
  //     description: 'As graceful as a ballerina, this water lily dances on the surface of the pond', instagramPostUrl: 'https://www.instagram.com/p/Crl6g5nI3gg/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-04-29'),
  //     images: [{ img: 'assets/org/RSCN1296.jpg', webp: 'assets/img/RSCN1296' }]
  //   },
  //   {
  //     description: 'The beauty of history never fades', instagramPostUrl: 'https://www.instagram.com/p/Cq6QAfwye1T/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-04-12'),
  //     images: [{ img: 'assets/org/DSCN0823.jpg', webp: 'assets/img/DSCN0823' }, { img: 'assets/org/DSCN0820.jpg', webp: 'assets/img/DSCN0820' }, { img: 'assets/org/DSCN0819.jpg', webp: 'assets/img/DSCN0819' }]
  //   },
  //   {
  //     description: 'Stepping back in time and admiring the beauty of historic architecture 🏛️🌿', instagramPostUrl: 'https://www.instagram.com/p/CqgMRApPRhu/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-04-01'),
  //     images: [{ img: 'assets/org/DSCN0828.jpg', webp: 'assets/img/DSCN0828' }]
  //   },
  //   {
  //     description: 'The beach, the clouds, and the golden hour ✨', instagramPostUrl: 'https://www.instagram.com/p/CqQ3Zo8PakT/?utm_source=ig_web_copy_link&igshid=ZWQ3ODFjY2VlOQ==',
  //     date: new Date('2023-03-27'),
  //     images: [{ img: 'assets/org/20230320_173423.jpg', webp: 'assets/img/20230320_173423' }]
  //   },
  // ];
  cardsToShow: number = this.calculateCardsToShow();
  totalCards = this.photos.length;
  swiperConfig: SwiperOptions = {
    spaceBetween: 100,
    //navigation: true,
    pagination: true,
    effect: 'slide',
    // autoHeight:true,
    // autoplay: {
    //   delay: this.getRandomDelay(1000, 5000),
    //   disableOnInteraction: true,
    //   pauseOnMouseEnter:true
    // },
    direction: 'horizontal',
    // on: {
    //   init: () => {
    //     // Handle the init event
    //     this.onSwiper();
    //   },
    //   slideChange: () => {
    //     const activeIndex =  this.swiper.nativeElement.swiper.activeIndex
    //     const slideNumber = activeIndex + 1;
    //     this.onSwiper(activeIndex, slideNumber);
    //   },
      
    // }
  }
  constructor(
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private _clipboardService: ClipboardService,
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver) { 
    this.imageSize = this.calculateImageSize(window.innerWidth);

      // Subscribe to breakpoint changes
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        // Update image size based on breakpoint
        this.imageSize = this.calculateImageSize(window.innerWidth);
      }
    });
    }

  ngOnInit() {
    this.fetchPhotos()
    this.titleService.setTitle('Photos.Clawiz');
    this.metaService.updateTag({ name: 'description', content: 'Capturing the essence of life in pixels🌿📷' });
    // this.isViewInitialized = true;
  }
  // ngAfterViewInit() {
  //   // this.swiper.nativeElement.swiper.activeIndex = this.index;
  // }

  onGalleryScroll(event: CustomEvent) {
    // Access scroll event details
    const scrollY = (event.detail as any)?.scrollTop;
    console.debug('Gallery scrolling, Y offset:', scrollY);
    // Your additional logic based on scroll position goes here
  }
  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }
  generateSrcset(photo: any): string {
    const breakpoints = [320, 480, 640, 800, 960, 1200, 1600, 1920]; // Add or remove breakpoints as needed
    return breakpoints.map(width => {
      return `${photo.webp}_${width}.webp ${width}w`;
    }).join(', ');
  }
  onImageLoad(index: number): void {
    this.imageLoaded[index] = true;
    console.log(index);
    
    if(index===5)
      this.isViewInitialized=true
  }

  fetchPhotos(): void {
    const apiUrl = `${environment.dataURL}`;

    // Make the API call
  this.http.get<Photo[]>(apiUrl).subscribe(
    (data: Photo[]) => {
      this.photos = this.updateImageUrls(data);
      // this.photos = data;
      this.totalCards = this.photos.length;
    },
    (error) => {
      console.error('Error fetching photos:', error);
    }
  );
  }

  updateImageUrls(photos: Photo[]): Photo[] {
    // Cloudflare R2 bucket URL
    const cloudflareBucketUrl = `${environment.bucketURL}`;
    const webp = `${environment.webpImagePath}`
    const img = `${environment.rawImagePath}`

    return photos.map((photo) => {
      // Update the image URLs based on the Cloudflare R2 bucket URL
      const updatedImages = photo.images.map((image) => {
        return {
          img: `${cloudflareBucketUrl}/${img}/${image.img}`,
          webp: `${cloudflareBucketUrl}/${webp}/${image.webp}`,
        };
      });

      // Update the photo object with the new image URLs
      return {
        ...photo,
        images: updatedImages,
      };
    });
  }

  calculateCardsToShow(): number {
    // Determine the screen width and set the number of cards accordingly
    const screenWidth = window.innerWidth;
    return screenWidth >= 768 ? 6 : 3; // Adjust the breakpoint (768) as needed
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   // Update the number of cards to show when the window is resized
  //   this.cardsToShow = this.calculateCardsToShow();
  // }

  loadMoreCards(event: any) {
    // Increment the number of cards to display
    this.cardsToShow += 3;
    if (this.cardsToShow >= this.totalCards) {
      // If no more images, disable the infinite scroll
      event.target.disabled = true;
    }
  }
  async openInstagram(image: any) {
    const postUrl = image.instagramPostUrl;
    if (postUrl) {
      this.openInstagramAppPost(postUrl);
    } else {
      console.log('No Instagram post URL available for this image.');
    }
  }
  openInstagramAppPost(postUrl: string) {
    if (this.platform.is('cordova')) {
      // If running on a device
      const instagramAppUrl = `instagram://media?id=${postUrl}`;
      this.platform.ready().then(() => {
        window.open(instagramAppUrl, '_system');
      });
    } else {
      // If running in a web browser
      // Implement logic for non-Cordova environments (e.g., open Instagram website)
      window.open(postUrl, '_blank');
    }
  }
  async shareInstagramPost(image: any) {
    const postUrl = image.instagramPostUrl;
    if (postUrl) {
      if (this.platform.is('desktop')) {
        try {
          await Share.share({
            url: postUrl,
          });
        } catch (error) {
          console.error('Error sharing Instagram post URL:', error);
        }
      } else {
        // For the web browser
        this.presentActionSheet(postUrl);
      }
    } else {
      console.log('No Instagram post URL available for this image.');
    }
  }
  openWhatsAppChat(instagramPostUrl: string) {
    // URL for sending a message on WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(instagramPostUrl)}`;

    // Open a new window
    window.open(whatsappUrl, '_blank');
  }
  async presentActionSheet(postUrl: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Share Options',
      buttons: [
        {
          text: 'Copy to Clipboard',
          icon: 'copy',
          handler: () => {
            this.copyToClipboard(postUrl);
          },
        },
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.openWhatsAppChat(postUrl);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  async copyToClipboard(content: string) {
    this._clipboardService.copyFromContent(content);
    this.presentToast('top');
  }
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
  async downloadImage(image: any) {
    if (this.platform.is('cordova')) {
      // If running on a device, use Cordova File plugin (as shown before)
      // ... (existing downloadImage logic)
    } else {
      // If running in a web browser
      const link = document.createElement('a');
      link.href = image;
      link.download = image || 'image.jpg'; // Set the desired file name
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  async openImageOptions(image: any, slideIndex: any) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Image Options',
      buttons: [
        {
          text: 'Open in Instagram',
          icon: 'logo-instagram',
          handler: () => {
            this.openInstagram(image);
          },
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            this.shareInstagramPost(image);
          },
        },
        {
          text: 'Download HQ',
          icon: 'download',
          handler: () => {
            const imagePath = image.images[slideIndex].img;
            this.downloadImage(imagePath);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

    // Method to calculate image size based on viewport width
    calculateImageSize(viewportWidth: number): string {
      if (viewportWidth <= 320) {
        return '280px';
      } else if (viewportWidth <= 480) {
        return '440px';
      } else if (viewportWidth <= 640) {
        return '600px';
      } else if (viewportWidth <= 800) {
        return '760px';
      } else if (viewportWidth <= 960) {
        return '920px';
      } else if (viewportWidth <= 1200) {
        return '1080px';
      } else if (viewportWidth <= 1600) {
        return '1440px';
      } else if (viewportWidth <= 1920) {
        return '1760px';
      } else {
        return '1920px';
      }
    }
}
