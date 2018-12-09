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
  private loginPage: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private formBuilder: FormBuilder, 
              private loadCtrl: LoadingController,
              private alertCtrl: AlertController,
              private api: APIService,
              private firebaseProvider: FirebaseProvider,) {

    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      cpassword: ['', Validators.required]
    });

    this.loginPage = LoginPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerAttempt(){
    let loadingLogin = this.loadCtrl.create({content: "Attempting to join the nest..."});
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
        this.firebaseProvider.signupUser(this.registerForm.value.email, this.registerForm.value.fullname, this.registerForm.value.password)
          .then( authData => {
            loadingLogin.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                title: 'Register Success',
                buttons: [
                  {
                    text: "OK"
                  }
                ]
              });
              alert.present();
              this.navCtrl.setRoot(LoginPage);
            });
          }, error => {
            loadingLogin.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                title: 'Register Failed 1',
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
            let alert = this.alertCtrl.create({
              title: 'Register Failed 2',
              subTitle: error.message,
              buttons: [
                {
                  text: "OK",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          })
      }
      else{
        let alert = this.alertCtrl.create({
					title: 'Register Failed 3',
					subTitle: response.result,
					buttons: ['OK']
				});
				alert.present();
      }
    }).subscribe();
  }
}
