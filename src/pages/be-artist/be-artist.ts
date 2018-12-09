import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the BeArtistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-be-artist',
  templateUrl: 'be-artist.html',
})
export class BeArtistPage {

  idUser: any;
  private formArtist: FormGroup;
  public backgroundProfileSelected : boolean;
  public imageBackgroundProfile : string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public camera: Camera, 
    public sanitizer:DomSanitizer,
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService) {

      this.formArtist= this.formBuilder.group({
        aboutMe: [''],
        fbLink: [''],
        twLink: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NativeBecomeArtistPage');
  }

  chooseImagePickerBackgroundProfile(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Set a Background Profile',
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            this.takePhoto();
          }
        },{
          text: 'Select from gallery',
          handler: () => {
            this.getImage();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto(){
    let settingImage;

    settingImage = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:true,
      correctOrientation: true
    }

    const options: CameraOptions = settingImage;
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageBackgroundProfile = 'data:image/jpeg;base64,' + imageData;
      this.backgroundProfileSelected = true;
    }, (err) => {
      // Handle error
    });
  }

  getImage(){
    let settingImage;
    
    settingImage = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    const options: CameraOptions = settingImage;

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageBackgroundProfile = 'data:image/jpeg;base64,' + imageData;
      this.backgroundProfileSelected = true;
    }, (err) => {
      // Handle error
    });
  }

  ngOnInit(){
    this.idUser = 168;
    
    this.backgroundProfileSelected = false;
    this.imageBackgroundProfile = "assets/imgs/upload_icon.png";
  }

  becomeArtist(){
    let loadingUpdate = this.loadingCtrl.create({content: "Considering you to become artist"});
    loadingUpdate.present();

    let dataToAPI = {
      'idArtist' : this.idUser,
      'facebookLink' : this.formArtist.value.fbLink,
      'twitterLink': this.formArtist.value.twLink,
      'aboutMe': this.formArtist.value.aboutMe,
      'BackgroundImage' : ''
    }

    if(this.backgroundProfileSelected){
      dataToAPI.BackgroundImage = this.imageBackgroundProfile;
    }

    this.api.postAPI(this.api.ARTIST_REGISTER ,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingUpdate.dismiss();
      
      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Welcome to the Artist Nest!',
					buttons: ['OK']
				});
				alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
					title: 'ERRROR',
					subTitle: response.result,
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();
  }

}
