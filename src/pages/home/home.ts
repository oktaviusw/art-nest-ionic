import { ArtworkDetailPage } from './../artwork-detail/artwork-detail';
import { ArtistPage } from './../artist/artist';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController} from 'ionic-angular';
import { APIService } from '../../service/webAPI';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { SearchPage } from '../search/search';
import { SearchResultPage } from '../search-result/search-result';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  artworks =[];
  artists = [];

  loading : any;

  constructor(public navCtrl: NavController, private api: APIService, public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

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

      this.api.getAPI(this.api.ARTIST_DATA_ALL)
      .map(response =>{
        this.artists = response.result;
        console.log(this.artists);
      }).subscribe();
  }

  checkArtworks() {
    if(this.artworks.length > 0){
      return true;
    }
  }

  openSearch(){
    let modal = this.modalCtrl.create(
      SearchPage,
      {showBackdrop: false, enableBackdropDismiss:true}
    );
    
		modal.present();
  }

  showAllResultArtwork(){
    this.navCtrl.push(SearchResultPage, {keyword: '', category: '', type: 'ARTWORK'});
  }

  showAllResultArtist(){
    this.navCtrl.push(SearchResultPage, {keyword: '', category: '', type: 'ARTIST'});
  }

  detailArtist(ID:any){
    console.log(ID);
    this.navCtrl.push(ArtistPage, {IDArtist : ID});
  }

  detailArtwork(ID:any){
    console.log(ID);
    this.navCtrl.push(ArtworkDetailPage, {IDArtwork : ID});
  }

}
