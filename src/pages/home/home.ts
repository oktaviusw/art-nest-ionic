import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { APIService } from '../../service/webAPI';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  artworks =[];

  constructor(public navCtrl: NavController, private api: APIService, public sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.api.getAPI(this.api.ARTWORK_DATA_ALL)
      .map(response =>{
        console.log(response);
        this.artworks = response.result;
        console.log(this.artworks);
      }).subscribe();
  }

  checkArtworks() {
    if(this.artworks.length > 0){
      return true;
    }
  }

}
