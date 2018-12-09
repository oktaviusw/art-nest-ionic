import { APIService } from '../../service/webAPI';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase';
import {RegisterPage} from '../../pages/register/register';
import { Storage } from "@ionic/storage";

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
              private firebaseProvider: FirebaseProvider,
              private storage: Storage) {

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
    let loadingLogin = this.loadCtrl.create({content: "Logging in..."});
    loadingLogin.present();

    let dataToAPI = {
      'Email' : this.loginForm.value.email,
      'Password' : this.loginForm.value.password 
    }
    this.api.postAPI(this.api.USERS_LOGIN,dataToAPI)
    .map(response =>{
      console.log(response);
      
      if(response.status == "OK"){
        this.storage.set('idUserSQL',response.result);
        //Login Firebase
        this.firebaseProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( loginUser => {
            this.storage.set('loginUser', loginUser);
            var x = this.storage.get('loginUser');
            console.log(JSON.stringify(x));
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
