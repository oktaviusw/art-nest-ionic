import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  idUser: any;
  private formUserSettings : FormGroup;
  public defaultProfilePictureURL : string;
  public profilePictureSelected : boolean;
  public imageProfilePicture: string;

  public isArtist : boolean;
  private formArtistSettings : FormGroup;
  public backgroundProfileSelected : boolean;
  public imageProfileBackground: string;
  public defaultBackgroundProfileURL : string;

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

      this.formUserSettings = this.formBuilder.group({
        displayName: ['', Validators.required],
        newPassword: [''],
        retypePassword: [''],
        currentPass: ['', Validators.required]
      });

      this.formArtistSettings = this.formBuilder.group({
        aboutMe: [''],
        fbLink: [''],
        twLink: [''],
        currentPass: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NativeUserSettigsPage');
  }

  chooseImagePickerProfilePicture(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Set a Profile Picture',
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            this.takePhoto('Profile');
          }
        },{
          text: 'Select from gallery',
          handler: () => {
            this.getImage('Profile');
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

  chooseImagePickerBackgroundProfile(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Set a Background Profile',
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            this.takePhoto('Background');
          }
        },{
          text: 'Select from gallery',
          handler: () => {
            this.getImage('Background');
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

  takePhoto(type: string){
    let settingImage;
    if(type=='Profile'){
      settingImage = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum:true,
        allowEdit: true,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true
      }
    }
    else{
      settingImage = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum:true,
        correctOrientation: true
      }
    }

    const options: CameraOptions = settingImage;
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      if(type=='Profile'){
        this.imageProfilePicture = 'data:image/png;base64,' + imageData;
        this.profilePictureSelected = true;
      }
      else{
        this.imageProfileBackground = 'data:image/jpeg;base64,' + imageData;
        this.backgroundProfileSelected = true;
      }
      this.profilePictureSelected = true;
    }, (err) => {
      // Handle error
    });
  }

  getImage(type: string){
    let settingImage;
    
    if(type=='Profile'){
      settingImage = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        targetWidth: 400,
        targetHeight: 400,
        saveToPhotoAlbum:false
      }
    }
    else{
      settingImage = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
      }
    }

    const options: CameraOptions = settingImage;

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      if(type=='Profile'){
        this.imageProfilePicture = 'data:image/png;base64,' + imageData;
        this.profilePictureSelected = true;
      }else{
        this.imageProfileBackground = 'data:image/jpeg;base64,' + imageData;
        this.backgroundProfileSelected = true;
      }
    }, (err) => {
      // Handle error
    });
  }

  ngOnInit(){
    this.idUser = 1;
    this.defaultProfilePictureURL = "";
    this.profilePictureSelected = false;
    this.imageProfilePicture = "assets/imgs/logo.png";

    this.isArtist = false;
    this.defaultBackgroundProfileURL = "";
    this.backgroundProfileSelected = false;
    this.imageProfileBackground = "";

    this.loadUserData();
  }

  loadUserData(){
    let loadingUserData = this.loadingCtrl.create({content: "Fetching your data.."});
    loadingUserData.present();

    this.api.getAPI(this.api.USERS_DATA+this.idUser)
    .map(response=>{
      console.log(response);
      loadingUserData.dismiss();

      if(response.status == "OK"){
        this.formUserSettings.controls['displayName'].setValue(response.result.DisplayName);
        this.imageProfilePicture = 'https://artnest-umn.000webhostapp.com/assets/userdata/'+response.result.EMail+'/ProfilePicture.png?random+\=' + Math.random();
        this.isArtist = response.result.isArtist;
        if(this.isArtist){
          this.loadArtistData();
        }
      }
      else{

      }
    }).subscribe();
  }

  loadArtistData(){
    let loadingArtistData = this.loadingCtrl.create({content: "Fetching artist data.."});
    loadingArtistData.present();

    this.api.getAPI(this.api.ARTIST_DATA_SINGLE+this.idUser)
    .map(response=>{
      console.log(response);
      loadingArtistData.dismiss();

      if(response.status == "OK"){
        this.formArtistSettings.controls['aboutMe'].setValue(response.result.AboutMe);

        let fbLinkBack = response.result.FacebookLink;
        fbLinkBack = fbLinkBack.replace('https:\/\/www.facebook.com\/','');
        this.formArtistSettings.controls['fbLink'].setValue(fbLinkBack);

        let twLinkBack = response.result.TwitterLink;
        twLinkBack = fbLinkBack.replace('https:\/\/twitter.com\/','');
        this.formArtistSettings.controls['twLink'].setValue(twLinkBack);

        this.imageProfileBackground = 'https://artnest-umn.000webhostapp.com/assets/userdata/'+response.result.EMail+'/BackgroundProfile.jpg?random+\=' + Math.random();
        console.log(this.imageProfileBackground);
      }
      else{
      }
    }).subscribe();
  }

  validateUserValueForm(){
    let newPass = this.formUserSettings.value.newPassword;
    let confirmPass = this.formUserSettings.value.retypePassword;
    let passAuth = this.formUserSettings.value.currentPass;

    if(passAuth != ""){
      if(newPass == confirmPass){
        this.updateUserSettings();
      }
      else{
        let alert = this.alertCtrl.create({
          title: 'Warning',
          subTitle: 'Your new password and confirmation password do not match.',
          buttons: ['OK']
        });
        alert.present();
      }
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Warning',
        subTitle: 'Please input your current password to continue.',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  
  updateUserSettings(){
    let loadingUpdate = this.loadingCtrl.create({content: "Updating User Data.."});
    loadingUpdate.present();

    let dataToAPI = {
      'IDTarget'      : this.idUser,
      'NewDisplayName': this.formUserSettings.value.displayName,
      'NewPassword'   : this.formUserSettings.value.newPassword,
      'PasswordAuth'  : this.formUserSettings.value.currentPass,
      'ProfilePict'   : ''
    }

    if(this.profilePictureSelected){
      dataToAPI.ProfilePict = this.imageProfilePicture;
    }

    this.api.postAPI(this.api.USERS_UPDATE ,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingUpdate.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Your user data updated!',
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

  validateArtistValueForm(){
    let passAuth = this.formArtistSettings.value.currentPass;

    if(passAuth != ""){
      this.updateArtistSettings();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Warning',
        subTitle: 'Please input your current password to continue.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  updateArtistSettings(){
    let loadingUpdate = this.loadingCtrl.create({content: "Updating Artist Data.."});
    loadingUpdate.present();

    let dataToAPI = {
      'IDTarget'          : this.idUser,
      'AboutMe'           : this.formArtistSettings.value.aboutMe,
      'FbLink'            : this.formArtistSettings.value.fbLink,
      'TwLink'            : this.formArtistSettings.value.twLink,
      'BackgroundImage'   : '',
      'PasswordAuth'      : this.formArtistSettings.value.currentPass
    }

    if(this.backgroundProfileSelected){
      dataToAPI.BackgroundImage = this.imageProfileBackground;
    }

    this.api.postAPI(this.api.ARTIST_UPDATE ,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingUpdate.dismiss();
      
      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Your artist data updated!',
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
