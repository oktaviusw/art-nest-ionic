import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, Events, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the ArtworkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-artwork',
  templateUrl: 'artwork.html',
})
export class ArtworkPage {
  idArtist: any;
  public artworkSelected : boolean;
  public imageArtwork: string;
  private formAddArtwork : FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public camera: Camera, 
    public file: File, 
    public sanitizer:DomSanitizer,
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService){

      this.formAddArtwork = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtworkPage');
  }

  close(){
    this.navCtrl.pop();
  }

  none(){
    event.stopPropagation();
  }

  chooseImagePicker(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Adding Artwork',
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
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageArtwork = 'data:image/png;base64,' + imageData;
      this.artworkSelected = true;
    }, (err) => {
      this.artworkSelected = false;
      // Handle error
    });
  }

  getImage(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageArtwork = 'data:image/png;base64,' + imageData;
      this.artworkSelected = true;
    }, (err) => {
      // Handle error
      this.artworkSelected = false;
    });
  }

  checkValidationForm(){
    if( this.formAddArtwork.valid && this.artworkSelected){
      return false;
    }
    else{
      return true;
    }
  }

  submitArtwork(){
    let loadingAdd = this.loadingCtrl.create({content: "Adding your masterpiece..."});
    loadingAdd.present();

    let dataToAPI = {
      'artistID'      : this.idArtist,
      'artworkTitle'  : this.formAddArtwork.value.title,
      'artworkDesc'   : this.formAddArtwork.value.description,
      'artworkImage'  : this.imageArtwork
    }

    this.api.postAPI(this.api.ARTWORK_ADD,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingAdd.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Your masterpiece has been added!',
					buttons: ['OK']
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
    this.idArtist = this.api.loggedInUser;
    this.imageArtwork = "";
    this.artworkSelected = false;
  }
}
