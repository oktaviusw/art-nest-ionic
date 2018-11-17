import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { APIService } from '../../service/webAPI';
import { HomePage } from './../home/home';
import { FirebaseProvider } from '../../providers/firebase';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  private registerForm: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private formBuilder: FormBuilder, 
              private loadCtrl: LoadingController,
              private alertCtrl: AlertController,
              private api: APIService,
              private firebadeProvider: FirebaseProvider) {

    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerAttempt(){
    let loadingLogin = this.loadCtrl.create({content: "Attempt to joining the nest.."});
    loadingLogin.present();

    let dataToAPI = {
      'DisplayName' : this.registerForm.value.fullname,
      'Email' : this.registerForm.value.email,
      'Password' : this.registerForm.value.password 
    }

    this.api.postAPI(this.api.USERS_REGISTER,dataToAPI)
    .map(response =>{
      console.log(response);

      loadingLogin.dismiss();
      if(response.status == "OK"){
        //Register Firebase
        this.firebadeProvider.signupUser(this.registerForm.value.fullname, this.registerForm.value.email, this.registerForm.value.password)
          .then( authData => {
            loadingLogin.dismiss().then( () => {
              this.navCtrl.setRoot(LoginPage);
            });
          }, error => {
            loadingLogin.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                title: 'Register Failed',
                subTitle: error.message,
                buttons: [
                  {
                    text: "OK",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          }).catch( error => {
            console.log(error);
          })
      }
      else{
        let alert = this.alertCtrl.create({
					title: 'Register Failed',
					subTitle: response.status,
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();
  }
}
