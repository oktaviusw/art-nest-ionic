import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Storage } from "@ionic/storage";
import { appconfig } from "../../app/app.config";
import { User } from "../../models/user";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { FirebaseProvider } from "../../providers/firebase";
import { ChatRoomPage } from "../chat-room/chat-room";

import { AlertController } from "ionic-angular";

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage implements OnInit {

  availableusers: any = [];
  chatuser:User;
  emailSet:any = [];

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
     
      firebase.firestore().collection(appconfig.chats_endpoint)
      .where("sender", "==", this.chatuser.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          // let data = doc.data().data;
          // dataSet.push(doc.data())
          if(!this.emailSet.includes(doc.data().receiverEmail)){
            this.emailSet.push(doc.data().receiverEmail);
          }
        })
        firebase.firestore().collection(appconfig.chats_endpoint)
        .where("receiverEmail", "==", this.chatuser.email)
        .get()
        .then((snapshot1) => {
          snapshot1.forEach((doc) => {
            // let data = doc.data().data;
            // dataSet.push(doc.data())
            if(!this.emailSet.includes(doc.data().sender)){
              this.emailSet.push(doc.data().sender);
            }
          })

          this.db
            .collection<User>(appconfig.users_endpoint)
            .valueChanges()
            .subscribe(users => {

              
              //this.availableusers = users;
              console.log(users);
              this.availableusers = users.filter(user => {
                if(this.emailSet.includes(user.email)){
                  return user;
                }
              });
            });

        })
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  goToChat(chatpartner) {
    this.firebaseProvider.currentChatPairId = this.firebaseProvider.createPairId(
      this.chatuser,
      chatpartner
    );

    this.firebaseProvider.currentChatPartner = chatpartner;

    this.navCtrl.push(ChatRoomPage);
  } //goToChat

}
