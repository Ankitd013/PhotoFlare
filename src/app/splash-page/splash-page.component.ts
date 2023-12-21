import { Component} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, NavController, IonNav } from '@ionic/angular/standalone';
import { iosTransitionAnimation } from '@ionic/core';
@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.component.html',
  styleUrls: ['./splash-page.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonNav],
})
export class SplashPageComponent{

  constructor(private navCtrl: NavController) { }

  ionViewDidEnter() {
    // Set a timer to navigate to the main page after 2 seconds
    
    setTimeout(() => {
      this.navCtrl.navigateForward('/gallery',{
        animation:iosTransitionAnimation,
        animationDirection: 'forward'
      }); 
    }, 1500);
  }
}
