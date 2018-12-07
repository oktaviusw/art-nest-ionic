import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Firebase } from '@ionic-native/firebase';
import firebase2 from 'firebase';
import { FirebaseProvider } from '../providers/firebase';

import { Storage } from '@ionic/storage';

import { ToastController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { ArtistPage } from '../pages/artist/artist';
import { ArtworkPage } from '../pages/artwork/artwork';
import { SettingPage } from '../pages/setting/setting';
import { RequestPage } from '../pages/request/request';
import { ProjectPage } from '../pages/project/project';
import { MessagePage } from '../pages/message/message';
import { BeArtistPage } from '../pages/be-artist/be-artist';
import { RegisterPage } from '../pages/register/register';
import { ModalOrderPage } from '../pages/modal-order/modal-order';
import { LoginPage } from '../pages/login/login'; 

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = LoginPage;
  artistPage:any = ArtistPage;
  artworkPage:any = ArtworkPage;
  homePage:any = HomePage;
  settingPage:any = SettingPage;
  projectPage:any = ProjectPage;
  requestPage:any = RequestPage;
  messagePage:any = MessagePage;
  beArtistPage:any = BeArtistPage;
  loginPage:any = LoginPage;

  @ViewChild('sideMenuContent') nav: NavController;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, toastCtrl: ToastController, private firebaseProvider: FirebaseProvider, private firebase: Firebase, private storage: Storage) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      console.log('platform ready');

      this.firebase.getToken()
      .then(token => {
        this.storage.set("deviceID", token);
        firebaseProvider.updateToken(token);
      }) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token: ', error));

      statusBar.styleDefault();
      splashScreen.hide();
    });

    const unsubscribe = firebase2.auth().onAuthStateChanged(user => {
      if (!user) {
        this.nav.setRoot(this.rootPage);
        unsubscribe();
      } else {
        this.nav.setRoot(HomePage);
        unsubscribe();
      }
    });

  }

  onLoad(page: any) {
    this.nav.push(page);
    this.menuCtrl.close();
  }

  logOut(){
    this.firebaseProvider.logoutUser();
    this.nav.setRoot(this.rootPage);
  }
}

