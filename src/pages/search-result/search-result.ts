import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  searchData : any;

  result : any = [];

  isArtistSearch : boolean;
  dataArtist : any;

  isArtworkSearch : boolean;
  dataArtwork : any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public api: APIService) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
  }

  ngOnInit(){
    this.searchData = {
      keywordSearch   : this.navParams.get('keyword'),
      categorySearch  : this.navParams.get('category'),
      typeSearch      : this.navParams.get('type')
    }

    this.isArtistSearch = false;
    this.dataArtist = [];
    this.isArtworkSearch = false;
    this.dataArtwork = [];

    if(this.searchData.typeSearch == "ARTIST"){
      this.isArtistSearch = true;
    }
    else if(this.searchData.typeSearch == "ARTWORK"){
      this.isArtworkSearch = true;
    }

    console.log(this.searchData);
    this.getResultSearch();
  }
  
  getResultSearch(){
    let loadingData = this.loadingCtrl.create({content: "Filtering the best for you.."});
    loadingData.present();

    this.api.postAPI(this.api.UTIL_SEARCH, this.searchData)
    .map(response=>{
      console.log(response);
      loadingData.dismiss();

      if(response.status == "OK"){
        if(this.isArtistSearch){
          this.dataArtist = response.result;
        }
        else if(this.isArtworkSearch){
          this.dataArtwork = response.result;
        }
      }
      else if(response.status == "EMPTY"){
      }
    }).subscribe();
  }
}
