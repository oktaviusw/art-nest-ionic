import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { APIService } from '../../service/webAPI';
import { ModalDetailPage } from '../modal-detail/modal-detail';

/**
 * Generated class for the ProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage implements OnInit {

  comissions = [];
  customer_id = 1;

  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public api: APIService) {
  }

  ngOnInit(){

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.customer_id = this.api.loggedInUser;

    this.api.getAPI(this.api.REQUEST_DATA_ALL + this.customer_id + '/ARTIST')
      .map(response =>{
        this.comissions = response.result;
        console.log(this.comissions);

        for (var i = 0; i < this.comissions.length; i++) {
          this.comissions[i].image = "";
          if(this.comissions[i].anySketchBase == true){
            this.comissions[i].image = 'https://artnest-umn.000webhostapp.com/assets/projectdata/'+this.comissions[i].IDProject+'/SketchBase.jpg';        
          }
          else{
            this.comissions[i].image = 'assets/imgs/application_logo.png';
          }
          
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
    console.log('ionViewDidLoad ProjectPage');
  }

  detailRequest(i) {
    let modal = this.modalCtrl.create(ModalDetailPage, {comission: this.comissions[i]});
    modal.present();

    modal.onDidDismiss(data=>{
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }
}
