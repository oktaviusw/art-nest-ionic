import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the ArtworkEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-artwork-edit',
  templateUrl: 'artwork-edit.html',
})
export class ArtworkEditPage {

  idArtwork : any;
  
  private formEditArtwork : FormGroup;
  public imageArtwork: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public sanitizer:DomSanitizer,
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService){

      this.formEditArtwork = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['']
      });
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditArtworkPage');
  }

  editArtwork(){
    let loadingAdd = this.loadingCtrl.create({content: "Refining the masterpiece.."});
    loadingAdd.present();

    let dataToAPI = {
      'IDTarget'      : this.idArtwork,
      'NewTitle'      : this.formEditArtwork.value.title,
      'NewDesc'       : this.formEditArtwork.value.description
    }

    this.api.postAPI(this.api.ARTWORK_UPDATE,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingAdd.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Your masterpiece refined!',
					buttons: [{
            text: 'OK',
            role: 'OK',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
				});
				alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
					title: 'ERRROR',
					subTitle: 'Something went wrong.',
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();  
  }

  ngOnInit(){
    this.idArtwork = this.navParams.get('idArtwork');

    this.getArtworkData();
  }
  
  getArtworkData(){
    let loadingUserData = this.loadingCtrl.create({content: "Getting your masterpice.."});
    loadingUserData.present();

    this.api.getAPI(this.api.ARTWORK_DATA_SINGLE+this.idArtwork)
    .map(response=>{
      console.log(response);
      loadingUserData.dismiss();

      if(response.status == "OK"){
        this.formEditArtwork.controls['title'].setValue(response.result.Title);
        this.formEditArtwork.controls['description'].setValue(response.result.DescriptionArtwork);

        this.imageArtwork = 'https://artnest-umn.000webhostapp.com/assets/userdata/'+response.result.EMail+'/artwork/'+response.result.DirectoryData;
      }
      else{

      }
    }).subscribe();
  }

}
