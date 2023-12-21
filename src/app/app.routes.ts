import { Routes } from '@angular/router';
import { SplashPageComponent } from './splash-page/splash-page.component';

export const routes: Routes = [
  {
    path: 'gallery',
    loadComponent: () => import('./gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'splash',
    component: SplashPageComponent
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
];
