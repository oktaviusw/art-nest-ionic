import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireModule } from '@angular/fire';

/**
 * Generated class for the ModalContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-contact',
  templateUrl: 'modal-contact.html',
})
export class ModalContactPage implements OnInit{

  linkFacebook: any;
  linkTwitter: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalContactPage');
  }

  close(){
    this.navCtrl.pop();
  }

  none(){
    event.stopPropagation();
  }

  ngOnInit(){

    this.linkFacebook = this.navParams.get('linkFacebook');
    this.linkTwitter = this.navParams.get('linkTwitter');
    
  }

}
