import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { ModalDetailPage } from '../modal-detail/modal-detail';
import { APIService } from '../../service/webAPI';

/**
 * Generated class for the RequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage implements OnInit {

  comissions = [];
  customer_id = 1;

  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public api: APIService) {
  }

  ngOnInit() {
    //Loading anim to wait for data
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.customer_id = this.api.loggedInUser;

    this.api.getAPI(this.api.REQUEST_DATA_ALL + this.customer_id + '/CUSTOMER')
      .map(response =>{
        this.comissions = response.result;
        console.log(this.comissions);

        // for(let i in this.comissions){
        //   this.comissions[i].state = "";
        //   if(this.comissions[i].RequestStatus == "ACCEPTED"){
        //     this.comissions[i].state = this.comissions[i].CommissionStatus;
        //   }
        //   else{
        //     this.comissions[i].state = this.comissions[i].RequestStatus;
        //   }
        // }

        for (var i = 0; i < this.comissions.length; i++) {
          this.comissions[i].state = "";
          if(this.comissions[i].RequestStatus == "ACCEPTED"){
            this.comissions[i].state = this.comissions[i].CommissionStatus;
          }
          else{
            this.comissions[i].state = this.comissions[i].RequestStatus;
          }
        }

        //dismiss anim
        this.loading.dismiss();
      }).subscribe();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestPage');
  }

  detailRequest(i) {
    let modal = this.modalCtrl.create(ModalDetailPage, {comission: this.comissions[i]});
    modal.present();

    modal.onDidDismiss(data=>{
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
    // this.navCtrl.push(ModalDetailPage, {comission: this.comissions[i]});
  }

}
