import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { APIService } from '../service/webAPI';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ArtistPage } from '../pages/artist/artist';
import { ArtworkPage } from '../pages/artwork/artwork';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SettingPage } from '../pages/setting/setting';
import { IntroPage } from '../pages/intro/intro';
import { RequestPage } from '../pages/request/request';
import { ProjectPage } from '../pages/project/project';
import { MessagePage } from '../pages/message/message';
import { BeArtistPage } from '../pages/be-artist/be-artist';

const firebase = {
  apiKey: "AIzaSyCtnhjQCrEh8yeXjrZXpZhPjNLH7XeAuPA",
  authDomain: "artnest-ca0ef.firebaseapp.com",
  databaseURL: "https://artnest-ca0ef.firebaseio.com",
  projectId: "artnest-ca0ef",
  storageBucket: "artnest-ca0ef.appspot.com",
  messagingSenderId: "1082674931088"
 };

@NgModule({
  declarations: [
    MyApp,
    ArtistPage,
    ArtworkPage,
    IntroPage,
    LoginPage,
    RegisterPage,
    SettingPage,
    HomePage,
    RequestPage,
    ProjectPage,
    MessagePage,
    BeArtistPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ArtistPage,
    ArtworkPage,
    IntroPage,
    LoginPage,
    RegisterPage,
    SettingPage,
    HomePage,
    RequestPage,
    ProjectPage,
    MessagePage,
    BeArtistPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    HttpClient,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    APIService
  ]
})
export class AppModule {}
