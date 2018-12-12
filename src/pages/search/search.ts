import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../service/webAPI';
import { SearchResultPage } from '../search-result/search-result';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  formSearch : FormGroup;
  category : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService) {

      this.formSearch = this.formBuilder.group({
        keyword: [''],
        category: [''],
        type: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  close(){
    this.navCtrl.pop();
  }

  none(){
    event.stopPropagation();
  }

  ngOnInit() {
    this.category = [];
    this.getCategoryData();
  }

  getCategoryData(){
    let loadingData = this.loadingCtrl.create({content: "Fetching category data.."});
    loadingData.present();

    this.api.getAPI(this.api.CATEGORY_ALL)
    .map(response=>{
      console.log(response);
      loadingData.dismiss();

      if(response.status == "OK"){
        this.category = response.result;
      }
      else{
      }
    }).subscribe();
  }

  startSearch(){
    this.navCtrl.push(SearchResultPage, this.formSearch.value);
  }
}
