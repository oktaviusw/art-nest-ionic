import { APIService } from '../../service/webAPI';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private formBuilder: FormBuilder, 
              private loadCtrl: LoadingController,
              private alertCtrl: AlertController,
              private api: APIService) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
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

      loadingLogin.dismiss();
      if(response.status == "OK"){
        //Login Firebase
        this.navCtrl.push(HomePage);
      }
      else{
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
