import { SearchResultPage } from './../pages/search-result/search-result';
import { CategoryPage } from './../pages/category/category';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DatePicker } from '@ionic-native/date-picker';
import { ImagePicker } from '@ionic-native/image-picker';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from "@ionic/storage";
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/* SERVICE */
import { APIService } from '../service/webAPI';

/* FIREBASE */
import { Firebase } from '@ionic-native/firebase';
import { FirebaseProvider } from '../providers/firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { appconfig } from "./app.config";

/* PAGE */
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
import { ListUserPage } from '../pages/list-user/list-user';
import { ChatRoomPage } from '../pages/chat-room/chat-room';

/* MODAL */
import { ModalOrderPage } from '../pages/modal-order/modal-order';
import { ModalDetailPage } from '../pages/modal-detail/modal-detail';
import { ModalContactPage } from '../pages/modal-contact/modal-contact'
import { Camera } from '@ionic-native/camera';
import { DatePipe } from '@angular/common';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { SearchPage } from '../pages/search/search';

/* PIPE */
import { PipesModule } from "../pipes/pipes.module";
import { ArtworkDetailPage } from '../pages/artwork-detail/artwork-detail';

@NgModule({
  declarations: [
    MyApp,
    ArtistPage,
    ArtworkPage,
    ArtworkDetailPage,
    IntroPage,
    LoginPage,
    RegisterPage,
    SettingPage,
    HomePage,
    RequestPage,
    ProjectPage,
    MessagePage,
    BeArtistPage,
    ModalOrderPage,
    ModalDetailPage,
    ModalContactPage,
    ListUserPage,
    ChatRoomPage,
    EditProfilePage,
    SearchPage,
    SearchResultPage,
    CategoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp(appconfig.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ArtistPage,
    ArtworkPage,
    ArtworkDetailPage,
    IntroPage,
    LoginPage,
    RegisterPage,
    SettingPage,
    HomePage,
    RequestPage,
    ProjectPage,
    MessagePage,
    BeArtistPage,
    ModalOrderPage,
    ModalDetailPage,
    ModalContactPage,
    ListUserPage,
    ChatRoomPage,
    EditProfilePage,
    SearchPage,
    SearchResultPage,
    CategoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    FirebaseProvider,
    Camera,
    Base64,
    HttpClient,
    HttpClientModule,
    DatePicker,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    APIService,
    ImagePicker,
    PhotoViewer
  ]
})
export class AppModule {}
