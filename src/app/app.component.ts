import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { ArtistPage } from '../pages/artist/artist';
import { ArtworkPage } from '../pages/artwork/artwork';
import { SettingPage } from '../pages/setting/setting';
import { RequestPage } from '../pages/request/request';
import { ProjectPage } from '../pages/project/project';
import { MessagePage } from '../pages/message/message';
import { BeArtistPage } from '../pages/be-artist/be-artist';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = ArtistPage;
  artistPage:any = ArtistPage;
  artworkPage:any = ArtworkPage;
  homePage:any = HomePage;
  settingPage:any = SettingPage;
  projectPage:any = ProjectPage;
  requestPage:any = RequestPage;
  messagePage:any = MessagePage;
  beArtistPage:any = BeArtistPage;

  @ViewChild('sideMenuContent') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.push(page);
    this.menuCtrl.close();
  }
}

