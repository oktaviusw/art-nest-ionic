import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild('slides') slides: Slides;

  page: number = 1;

  btnPrevText: string = "";
  btnNextText: string = "Next";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  next() {
    this.slides.slideNext();
    this.page = this.page + 1;

    if(this.page < 1){
      this.page = 1;
    }
    if(this.page > 5){
      this.page = 5;
      this.navCtrl.setRoot(LoginPage);
    }
    
    if(this.page == 1){
      this.btnPrevText = "";
      this.btnNextText = "Next";
    }
    else if(this.page == 5){
      this.btnPrevText = "Prev";
      this.btnNextText = "Sign In";
    }
    else{
      this.btnPrevText = "Prev";
      this.btnNextText = "Next";
    }
  }

  prev() {
    this.slides.slidePrev();
    this.page = this.page - 1;

    if(this.page < 1){
      this.page = 1;
    }
    if(this.page > 5){
      this.page = 5;
    }

    if(this.page == 1){
      this.btnPrevText = "";
      this.btnNextText = "Next";
    }
    else if(this.page == 5){
      this.btnPrevText = "Prev";
      this.btnNextText = "Sign In";
    }
    else{
      this.btnPrevText = "Prev";
      this.btnNextText = "Next";
    }
  }

}
