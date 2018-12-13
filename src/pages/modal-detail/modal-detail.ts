import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { APIService } from '../../service/webAPI';
import { FirebaseProvider } from '../../providers/firebase'

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
  comissionDetails: any = [];
  comission_id = 0;
  loading:any;
  needCustomerResponse:boolean = false;
  needArtistResponse:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public loadingCtrl: LoadingController, public api: APIService, public alertCtrl : AlertController,
            public firebaseProvider: FirebaseProvider
            ) {         
  }

  ngOnInit(){
    this.needArtistResponse = false;
    this.needCustomerResponse = false;

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
        this.loading.dismiss();
        
        if(response.result.RequestStatus == "ACCEPTED"){
          if(response.result.CommissionStatus != "FINISHED"){
            if(this.api.loggedInUser == response.result.IDArtist){
              this.needArtistResponse = true;
            }
            else{
              this.needArtistResponse = false;
            }
          }
        }
        else if(response.result.RequestStatus == "PENDING"){
          if(this.api.loggedInUser == response.result.IDCustomer){
            this.needCustomerResponse = true;
          }
          else{
            this.needCustomerResponse = false;
          }
        }
        
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

  artistAccept(){
    let dataToAPI = {
      projectID : this.comission_id,
      responseCustomer : 'ACCEPT'
    }

    this.updateCommission(dataToAPI, 'ARTIST');
  }

  artistReject(){
    let dataToAPI = {
      projectID : this.comission_id,
      responseCustomer : 'DECLINE'
    }

    this.updateCommission(dataToAPI, 'ARTIST');
  }

  customerAccept(){
    let dataToAPI = {
      projectID : this.comission_id,
      responseCustomer : 'ACCEPT'
    }

    this.updateCommission(dataToAPI, 'CUSTOMER');
  }

  customerReject(){
    let dataToAPI = {
      projectID : this.comission_id,
      responseCustomer : 'DECLINE'
    }

    this.updateCommission(dataToAPI, 'CUSTOMER');
  }

  updateCommission(data : any, role:string){
    let loadingUpdate = this.loadingCtrl.create({content: "Updating Project Data.."});
    loadingUpdate.present();

    this.api.postAPI(this.api.REQUEST_RESPONSE ,data)
    .map(response =>{
      console.log(response);
      loadingUpdate.dismiss();

      let contentMessage = "";


      if(response.status == "OK"){
        if(role == 'ARTIST'){
          if(data.responseCustomer == 'ACCEPT'){
            contentMessage = "Project has been completed";
          }
          else{
            contentMessage = "Project has been terminated";
          }
          this.firebaseProvider.addNotification(this.comissionDetails.TitleProject, contentMessage + " by " + this.comissionDetails.CustomerName, this.comissionDetails.CustomerEMail)
        }
        else{
          if(data.responseCustomer == 'ACCEPT'){
            contentMessage = "Commission has been accepted";
          }
          else{
            contentMessage = "Commission has been declined";
          }
          this.firebaseProvider.addNotification(this.comissionDetails.TitleProject, contentMessage + " by " + this.comissionDetails.ArtistName, this.comissionDetails.ArtistEMail)
        }
        

        let alert = this.alertCtrl.create({
					title: 'SUCCESS',
					subTitle: contentMessage,
					buttons: [{
            text: 'OK',
            role: 'OK',
            handler: () => {
              //this.getDataCategories();
              this.navCtrl.pop();
            }
          }]
				});
				alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
					title: 'ERROR',
					subTitle: response.result,
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();
  }

}
