import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Storage } from "@ionic/storage";
import { appconfig } from "../../app/app.config";
import { User } from "../../models/user";

import { FirebaseProvider } from "../../providers/firebase";
import { ChatRoomPage } from "../chat-room/chat-room";

import { AlertController } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-list-user',
  templateUrl: 'list-user.html',
})
export class ListUserPage implements OnInit{
  availableusers: any = [];
  chatuser:User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: AngularFirestore,
    private storage: Storage,
    private firebaseProvider: FirebaseProvider,
    private alertCtrl: AlertController
  ){}

  ngOnInit() {
    //Fetch other users

    this.storage.get("currentUser").then(currentUser => {
      let userCredential = JSON.parse(currentUser);
      this.chatuser = {
        email: userCredential.user.email,
        uID: userCredential.user.uID,
        username: userCredential.user.displayName,
        deviceID: '',
        time: new Date().getTime()
      }
      this.db
        .collection<User>(appconfig.users_endpoint)
        .valueChanges()
        .subscribe(users => {
          //this.availableusers = users;
          console.log(users);
          this.availableusers = users.filter(user => {
            if (user.email != this.chatuser.email) {
              return user;
            }
          });
        });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListUserPage');
  }

  goToChat(chatpartner) {
    this.firebaseProvider.currentChatPairId = this.firebaseProvider.createPairId(
      this.chatuser,
      chatpartner
    );

    this.firebaseProvider.currentChatPartner = chatpartner;

    this.navCtrl.push(ChatRoomPage).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Failed goToChat',
        subTitle: error.message,
        buttons: [
          {
            text: "OK"
          }
        ]
      });
      alert.present();
    });
  } //goToChat

}
