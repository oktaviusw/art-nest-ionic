import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, ToastController, AlertController, Events, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Firebase } from '@ionic-native/firebase';
import firebase2 from 'firebase';
import { FirebaseProvider } from '../providers/firebase';

import { Storage } from '@ionic/storage';

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
import { ListUserPage } from '../pages/list-user/list-user';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { SearchPage } from '../pages/search/search';
import { APIService } from '../service/webAPI';

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
  listUserPage:any = ListUserPage;
  editProfilePage:any = EditProfilePage;
  searchPage:any = SearchPage;

  displayName: string;
  email: string;
  photoURL: string;
  artist = [];
  user_id:any;

  @ViewChild('sideMenuContent') nav: NavController;
  
  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private menuCtrl: MenuController, 
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,
    private firebaseProvider: FirebaseProvider, 
    private firebase: Firebase, 
    private storage: Storage,
    public events: Events,
    public loadingCtrl: LoadingController,
    public api: APIService) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      console.log('platform ready');

      //Ambil data firebase user yang tersimpan di storage saat login 
      this.storage.get('currentUser')
      .then(currentUser => {
        let userCredential:firebase.auth.UserCredential = JSON.parse(currentUser);
        if(userCredential != null){
          this.changeDisplayName(userCredential.user.displayName, userCredential.user.email, userCredential.user.photoURL);
        }
      })

      statusBar.styleDefault();
      splashScreen.hide();
    });

    const unsubscribe = firebase2.auth().onAuthStateChanged(user => {
      if (!user) {
        this.nav.setRoot(LoginPage);
        unsubscribe();
      } else {
        this.firebaseProvider.updateToken();
        this.nav.setRoot(LoginPage);
        unsubscribe();
      }
    });

    events.subscribe('user:changeDisplayName', (displayName, email, photoURL) => {
      this.changeDisplayName(displayName, email, photoURL);
    });

      events.subscribe('userLoggedIn', (user_id) => {
        let loading;
        loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        this.user_id = user_id;
        this.api.getAPI(this.api.USERS_DATA + this.user_id)
          .map(response =>{
            this.artist = response.result;
            console.log(this.artist);
            loading.dismiss();
          }).subscribe();
      });

  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  changeDisplayName(displayName: string, email: string, photoURL: string) {
    this.displayName = displayName;
    this.email = email;
    this.photoURL = photoURL;

    let alert = this.alertCtrl.create({
      title: 'Change Display Name',
      subTitle: photoURL,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    alert.present();
    
  }

  logOut(){
    this.firebaseProvider.logoutUser();
    this.nav.setRoot(this.rootPage);
  }
}

