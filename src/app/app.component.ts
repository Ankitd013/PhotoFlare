import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DisableRightClickDirective } from './disable-right-click.directive';
import { register } from 'swiper/element/bundle';
import { HttpClientModule } from '@angular/common/http';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, DisableRightClickDirective, HttpClientModule, ],
})
export class AppComponent {
  constructor() {}
}
