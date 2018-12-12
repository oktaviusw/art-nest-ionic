import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Alert } from 'ionic-angular';

import { ModalOrderPage } from '../modal-order/modal-order';
import { APIService } from '../../service/webAPI';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';
import { ArtworkPage } from '../artwork/artwork';
import { ArtworkDetailPage } from '../artwork-detail/artwork-detail';
import { ChatRoomPage } from "../chat-room/chat-room";
import { ModalContactPage } from '../../pages/modal-contact/modal-contact'

import { FirebaseProvider } from "../../providers/firebase"

import { User } from '../../models/user'

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
    public storage: Storage, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) {
  }

  ngOnInit() {

    //Loading anim to wait for data
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.artist_id = this.api.loggedInUser;

    console.log(this.navParams.get('IDArtist'));
    
    //Get single data from artist
    this.api.getAPI(this.api.ARTIST_DATA_SINGLE + (this.navParams.get('IDArtist') == null ? this.artist_id : this.navParams.get('IDArtist')))
      .map(response =>{
        this.artist = response.result;
        //console.log(this.artist);
        //Data is now loaded; dismiss load anim
        this.loading.dismiss();
      }).subscribe();
  }

  isThisUser(){
    let artistparam = this.navParams.get('IDArtist');
    if(artistparam == null){
      return true;
    } if(artistparam == this.api.loggedInUser){
      return true;
    } else {
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistPage');
  }

  editProfile(){
    this.navCtrl.push(EditProfilePage);
  }

  createCommission() {
    this.navCtrl.push(ModalOrderPage);
  }

  addArtwork(){
    this.navCtrl.push(ArtworkPage);
  }

  openSearch(){
    let modal = this.modalCtrl.create(
      SearchPage,
      {showBackdrop: false, enableBackdropDismiss:true}
    );
    
    modal.present();
  }

  detailArtwork(artwork:any){
    
    this.navCtrl.push(ArtworkDetailPage, {IDArtwork : artwork.IDArtwork});
  }

  openModalContact(artist: any){
    let modal = this.modalCtrl.create(
      ModalContactPage,
      {showBackdrop: false, enableBackdropDismiss:true, linkFacebook: artist.FacebookLink, linkTwitter: artist.TwitterLink}
    );
    
    modal.present();
  }

  sendEmail(email: any){
    let Link="mailto:"+email;
    window.open(Link, "_system");
  }

  openChat(artist){
    let chatuser: User;
    let chatpartner: User;

    this.firebaseProvider.getDeviceId(artist.EMail)
      .then((snapshot) => {

        let alert = this.alertCtrl.create({
          title: 'Open Chat artist.ts',
          subTitle: JSON.stringify(snapshot),
          buttons: [
            {
              text: "OK"
            }
          ]
        });
        alert.present();
        
        this.storage.get("currentUser").then(currentUser => {
          let userCredential = JSON.parse(currentUser);
            chatuser = {
                email: userCredential.user.email,
                uID: userCredential.user.uID,
                username: userCredential.user.displayName,
                deviceID: '',
                time: new Date().getTime()
            }
              
            chatpartner = {
              email: artist.EMail,
              uID: '',
              username: artist.DisplayName,
              deviceID: snapshot,
              time: new Date().getTime()
            }

            // let alert = this.alertCtrl.create({
            //   title: 'Open Chat artist.ts',
            //   subTitle: JSON.stringify(chatuser) + JSON.stringify(chatpartner),
            //   buttons: [
            //     {
            //       text: "OK"
            //     }
            //   ]
            // });
            // alert.present();

            this.firebaseProvider.currentChatPairId = this.firebaseProvider.createPairId(
              chatuser,
              chatpartner
            );

            this.firebaseProvider.currentChatPartner = chatpartner;
            this.navCtrl.push(ChatRoomPage);
        })
      })
  }

}
