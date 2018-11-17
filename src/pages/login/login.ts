import { APIService } from '../../service/webAPI';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase';
import {RegisterPage} from '../../pages/register/register'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm: FormGroup;
  private registerPage: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private formBuilder: FormBuilder, 
              private loadCtrl: LoadingController,
              private alertCtrl: AlertController,
              private api: APIService,
              private firebadeProvider: FirebaseProvider) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerPage = RegisterPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginAttempt(){
    let loadingLogin = this.loadCtrl.create({content: "Loging in..."});
    loadingLogin.present();

    let dataToAPI = {
      'Email' : this.loginForm.value.email,
      'Password' : this.loginForm.value.password 
    }
    this.api.postAPI(this.api.USERS_LOGIN,dataToAPI)
    .map(response =>{
      console.log(response);
      
      if(response.status == "OK"){
        //Login Firebase
        this.firebadeProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
            loadingLogin.dismiss().then( () => {
              this.navCtrl.setRoot(HomePage);
            });
          }, error => {
            loadingLogin.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                title: 'Login Failed',
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
        loadingLogin.dismiss();
        let alert = this.alertCtrl.create({
					title: 'Login Failed',
					subTitle: 'Invalid username or password.',
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();    
  }
}
