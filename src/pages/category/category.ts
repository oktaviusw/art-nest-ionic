import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  idUser: any;

  isDeleteCategory : boolean;
  formDeleteCategory : FormGroup;
  currentCategory : any;

  isAddCategory : boolean;
  formAddCategory : FormGroup;
  availableCategory : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService) {

      this.formDeleteCategory = this.formBuilder.group({
        category: ['', Validators.required],
        passwordAuth: ['', Validators.required]
      });

      this.formAddCategory = this.formBuilder.group({
        category: ['', Validators.required],
        passwordAuth: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteCategoryPage');
  }

  ngOnInit() {
    this.idUser = 1;

    this.isAddCategory = true;
    this.isDeleteCategory = true;

    this.getDataCategories();
  }

  getDataCategories(){
    let loadingUserData = this.loadingCtrl.create({content: "Fetching category data.."});
    loadingUserData.present();

    this.api.getAPI(this.api.ARTIST_DATA_SINGLE+this.idUser)
    .map(response=>{
      console.log(response);
      loadingUserData.dismiss();

      if(response.status == "OK"){
        this.currentCategory = response.result.Categories;
        this.isDeleteCategory = true;
      }
      else{
        this.isDeleteCategory = false;
      }
    }).subscribe();

    this.api.getAPI(this.api.CATEGORY_AVAILABLE+this.idUser)
    .map(response=>{
      console.log(response);

      if(response.status == "OK"){
        this.availableCategory = [];

        for(let i in response.result){
          this.availableCategory.push(response.result[i].CategoryName);
        }
        this.isAddCategory = true;
      }
      else{
        this.isAddCategory = false;
      }
    }).subscribe();
  }

  empty(){

  }

  addCategory(){
    let loadingModal = this.loadingCtrl.create({content: "Adding new category.."});
    loadingModal.present();

    let dataToAPI = {
      'idArtist'          : this.idUser,
      'passwordArtist'    : this.formAddCategory.value.passwordAuth,
      'newCategoryArtist' : this.formAddCategory.value.category
    }

    this.api.postAPI(this.api.CATEGORY_ADD ,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingModal.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Category Sucessfully Added!',
					buttons: [{
            text: 'OK',
            role: 'OK',
            handler: () => {
              this.getDataCategories();
            }
          }]
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

  deleteCategory(){
    let loadingModal = this.loadingCtrl.create({content: "Deleting category.."});
    loadingModal.present();

    let dataToAPI = {
      'idArtist'              : this.idUser,
      'passwordArtist'        : this.formDeleteCategory.value.passwordAuth,
      'targetCategoryArtist'  : this.formDeleteCategory.value.category
    }

    this.api.postAPI(this.api.CATEGORY_DELETE ,dataToAPI)
    .map(response =>{
      console.log(response);
      loadingModal.dismiss();

      if(response.status == "OK"){
        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: 'Category Sucessfully Deleted!',
					buttons: [{
            text: 'OK',
            role: 'OK',
            handler: () => {
              this.getDataCategories();
            }
          }]
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
