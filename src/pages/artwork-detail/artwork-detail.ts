import { ArtworkEditPage } from './../artwork-edit/artwork-edit';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the ArtworkDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-artwork-detail',
  templateUrl: 'artwork-detail.html',
})
export class ArtworkDetailPage {

  idArtwork: any;
  titleArtwork : string;
  descArtwork : string;
  imageArtwork : string;
  ownArtwork : boolean;

  idArtist: any;
  displaynameArtist: string;
  imageArtist: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public sanitizer:DomSanitizer,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public api: APIService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailArtworkPage');
  }

  ngOnInit() {
    this.ownArtwork = false;
    this.idArtwork = this.navParams.get('IDArtwork');

    this.getArtworkData();
  }

  getArtworkData(){
    let loadingUserData = this.loadingCtrl.create({content: "Preparing the masterpiece.."});
    loadingUserData.present();

    console.log(this.api.ARTWORK_DATA_SINGLE+this.idArtwork);

    this.api.getAPI(this.api.ARTWORK_DATA_SINGLE+this.idArtwork)
    .map(response=>{
      console.log(response);
      loadingUserData.dismiss();

      if(response.status == "OK"){
        this.titleArtwork = response.result.Title;
        this.descArtwork = response.result.DescriptionArtwork;
        this.imageArtwork ='https://artnest-umn.000webhostapp.com/assets/userdata/'+response.result.EMail+'/artwork/'+response.result.DirectoryData;
        
        this.displaynameArtist = response.result.DisplayName;
        this.imageArtist = 'https://artnest-umn.000webhostapp.com/assets/userdata/'+response.result.EMail+'/ProfilePicture.png?math='+Math.random();

        if(response.result.IDArtist == this.api.loggedInUser){
          this.ownArtwork = true;
        }
      }
      else{

      }
    }).subscribe();
  }

  editArtwork(){
    let modal = this.modalCtrl.create(ArtworkEditPage,{idArtwork : this.idArtwork});
    modal.present();

    modal.onDidDismiss(data=>{
      this.getArtworkData();
    });

  }

  deleteArtwork(){
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      subTitle: 'Are you sure you want to delete '+this.titleArtwork+'?',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          let loadingUpdate = this.loadingCtrl.create({content: "Cleaning your masterpiece.."});
          loadingUpdate.present();

          this.api.getAPI(this.api.ARTWORK_DELETE+this.idArtwork)
          .map(response=>{
            console.log(response);
            loadingUpdate.dismiss();

            if(response.status == "OK"){
              let alertSuccess = this.alertCtrl.create({
                title: 'Confirmation',
                subTitle: 'Masterpiece has been cleaned!',
                buttons: [{
                  text: 'OK',
                  role: 'OK',
                  handler: () => {
                    this.navCtrl.pop();
                  }
                }]
              });

              alertSuccess.present();
            }
            else{
              let alertFailed = this.alertCtrl.create({
                title: 'ERROR',
                subTitle : 'Something went wrong',
                buttons : ['OK']
              })

              alertFailed.present();
            }
          }).subscribe();
        }
      }]
    });
    alert.present();
  }

}
