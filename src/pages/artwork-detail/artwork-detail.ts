import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
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

  idArtist: any;
  displaynameArtist: string;
  imageArtist: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public sanitizer:DomSanitizer,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailArtworkPage');
  }

  ngOnInit() {
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
      }
      else{

      }
    }).subscribe();
  }

}
