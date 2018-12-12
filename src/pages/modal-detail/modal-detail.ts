import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the ModalDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-detail',
  templateUrl: 'modal-detail.html',
})
export class ModalDetailPage implements OnInit {

  comission:any;
  comissionDetails = [];
  comission_id = 0;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public loadingCtrl: LoadingController, public api: APIService) {

  }

  ngOnInit(){

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.comission = this.navParams.get('comission');
    this.comission_id = this.comission.IDProject;
    console.log(this.comission_id);

    //Get single data from artist
    this.api.getAPI(this.api.REQUEST_DATA_SINGLE + this.comission_id)
      .map(response =>{
        this.comissionDetails = response.result;
        console.log(this.comissionDetails);
        //Data is now loaded; dismiss load anim
        this.loading.dismiss();
      }).subscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalDetailPage');
  }
  close(){
    this.navCtrl.pop();
  }

  none(){
    event.stopPropagation();
  }
}
