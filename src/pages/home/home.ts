import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { APIService } from '../../service/webAPI';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  artworks =[];

  loading : any;

  constructor(public navCtrl: NavController, private api: APIService, public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController) {

  }

  ngOnInit() {
    //Loading anim to wait for data
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.api.getAPI(this.api.ARTWORK_DATA_ALL)
      .map(response =>{
        console.log(response);
        this.artworks = response.result;
        console.log(this.artworks);

        //yes, the loading anim dismisses when only one is finished. good enough.
        this.loading.dismiss();
      }).subscribe();
  }

  checkArtworks() {
    if(this.artworks.length > 0){
      return true;
    }
  }

}
