import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { ModalOrderPage } from '../modal-order/modal-order';
import { APIService } from '../../service/webAPI';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';
import { ArtworkPage } from '../artwork/artwork';

/**
 * Generated class for the ArtistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html',
})
export class ArtistPage implements OnInit {

  artist = [];
  artist_id:any;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private modalCtrl: ModalController, private api: APIService, public loadingCtrl: LoadingController,
    public storage: Storage) {
  }

  ngOnInit() {

    //Loading anim to wait for data
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.storage.get('idUserSQL').then((val) => {

      this.artist_id = val;
      //Get single data from artist
      this.api.getAPI(this.api.ARTIST_DATA_SINGLE + this.artist_id)
        .map(response =>{
          this.artist = response.result;
          //console.log(this.artist);
          //Data is now loaded; dismiss load anim
          this.loading.dismiss();
        }).subscribe();

    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistPage');
  }

  editProfile(){
    this.navCtrl.setRoot(EditProfilePage);
  }

  createCommission() {
    let modal = this.modalCtrl.create(
      ModalOrderPage,
      {showBackdrop: false, enableBackdropDismiss:true}
    );
    
		modal.present();
  }

  addArtwork(){
    let modal = this.modalCtrl.create(
      ArtworkPage,
      {showBackdrop: false, enableBackdropDismiss:true}
    );
    
		modal.present();
  }

  openSearch(){
    let modal = this.modalCtrl.create(
      SearchPage,
      {showBackdrop: false, enableBackdropDismiss:true}
    );
    
		modal.present();
  }

}
