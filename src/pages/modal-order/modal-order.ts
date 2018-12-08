import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { DatePickerOptions, DatePicker } from '@ionic-native/date-picker';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { APIService } from '../../service/webAPI';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the ModalOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-order',
  templateUrl: 'modal-order.html',
})
export class ModalOrderPage {
  idUser: any;
  private formCommission : FormGroup;
  public imageSketchSelected : boolean;
  public imageSketch : string;

  public startDate : Date;
  public startDateSelected : boolean;
  public endDate: Date;
  public endDateSelected : boolean;

  constructor(public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public camera: Camera, 
    public sanitizer:DomSanitizer,
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService,
    public datepicker: DatePicker,
    public datepipe: DatePipe) {

      this.formCommission = this.formBuilder.group({
        title: ['', Validators.required],
        customer: ['', Validators.required],
        price: ['', Validators.required],
        description: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NativeAddCommissionPage');
  }

  ngOnInit() {
    this.idUser = 1;
    
    this.imageSketchSelected = false;
    this.imageSketch = "";

    let currDate = new Date();

    this.startDate = new Date(currDate.getTime()+(24 * 60 * 60 * 1000));
    this.startDateSelected = false;

    this.endDate = new Date();
    this.endDateSelected = false;
  }

  pickStartDate(){
    try{
      const datePickerOptions : DatePickerOptions = {
        titleText : 'Pick Start Date',
        mode : 'date',
        date : this.startDate,
        minDate : this.startDate,
        androidTheme: this.datepicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
      }

      this.datepicker.show(datePickerOptions).
      then(
        date => {
          this.startDate = date;
          this.startDateSelected = true;
        },
        err => {

        }
      );
    }
    catch(e){
      console.error(e);
    }
  }

  pickEndDate(){
    try{
      const datePickerOptions : DatePickerOptions = {
        titleText : 'Pick End Date',
        mode : 'date',
        date : this.endDate,
        minDate : this.endDate,
        androidTheme: this.datepicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
      }

      this.datepicker.show(datePickerOptions).
      then(
        date => {
          this.endDate = date;
          this.endDateSelected = true;
        },
        err => {

        }
      );
    }
    catch(e){
      console.error(e);
    }
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
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageSketch = 'data:image/png;base64,' + imageData;
      this.imageSketchSelected = true;
    }, (err) => {
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
      this.imageSketch = 'data:image/png;base64,' + imageData;
      this.imageSketchSelected = true;
    }, (err) => {
      // Handle error
    });
  }

  validateCommissionValueForm(){
    if(this.formCommission.valid == true && this.startDateSelected && this.endDateSelected){
      return false;
    }
    else{
      return true;
    }
  }

  submitCommission(){
    let check = true;
    let errorMessage = "";

    /*Cek start date minimal adalah besok*/
    let minimumStartDate = new Date();

    if(minimumStartDate > this.startDate){
      check = false;
      errorMessage += "Tanggal mulai memiliki minimum yaitu satu hari setelah pembuatan request.";
    }
    else{
      if(this.startDate > this.endDate){
        check = false;
        errorMessage += "Tanggal akhir harus lebih besar dari tanggal awal.";
      }
    }

    if(check){
      this.uploadToServer();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Validaton Error',
        subTitle: errorMessage,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  uploadToServer(){
    let loadingAdd = this.loadingCtrl.create({content: "Processing your order.."});
    loadingAdd.present();

    let dataToAPI = {
      'IDArtist'        : this.idUser,
      'EmailCustomer'   : this.formCommission.value.customer,
      'TitleProject'    : this.formCommission.value.title,
      'DateStart'       : this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      'DateEnd'         : this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      'TokenValue'      : this.formCommission.value.price,
      'Description'     : this.formCommission.value.description,
      'SketchBase'      : ''
    }

    if(this.imageSketchSelected){
      dataToAPI.SketchBase = this.imageSketch;
    }

    this.api.postAPI(this.api.REQUEST_ADD,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingAdd.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Your order request has been created!',
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
