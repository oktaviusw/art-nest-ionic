import { Injectable } from '@angular/core';

import firebase from 'firebase';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";

import { appconfig } from "../app/app.config";
import { Chat } from "../models/chat";
import { User } from "../models/user";

import { Storage } from "@ionic/storage";

import { AlertController } from "ionic-angular";


 
@Injectable()
export class FirebaseProvider {

  currentUser: firebase.auth.UserCredential;

  users: AngularFirestoreCollection<User>;

  chats: AngularFirestoreCollection<Chat>;

  //The pair string for the two users currently chatting
  currentChatPairId;
  currentChatPartner;

  constructor(private db: AngularFirestore, private storage: Storage, private alertCtrl: AlertController) {
    this.users = db.collection<User>(appconfig.users_endpoint);
    this.chats = db.collection<Chat>(appconfig.chats_endpoint);
  }

  updateToken(token){

    this.db.collection('users', ref => ref.where("uID", "==", "xx"))
      .ref
      .get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          this.db.collection(appconfig.users_endpoint)
            .doc(doc.id)
            .update({
              deviceID: token
            })
        });
      })
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(loginUser => {
        this.currentUser = loginUser;
      });
  }

  async signupUser(email: string, username: string, password: string): Promise<any> {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then( newUser => {
            newUser.user.getIdToken()
              .then( deviceID => {
                this.db.collection(appconfig.users_endpoint).add({
                  email: email,
                  uID: newUser.user.uid,
                  username: username,
                  deviceID: deviceID,
                  time: new Date().getTime()
              })
              .catch( error => {
                let alert = this.alertCtrl.create({
                  title: 'Register Service Failed 1',
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
            
          })
          .catch(error =>{
            let alert = this.alertCtrl.create({
              title: 'Register Service Failed 2',
              subTitle: error.message,
              buttons: [
                {
                  text: "OK",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          }
          )
        });
  }

  logoutUser(){
    return firebase.auth().signOut();
  }

  addChat(chat: Chat) {
    return this.chats.add(chat);
  } //addChat

  createPairId(user1, user2) {
    let pairId;
    if (user1.time < user2.time) {
      pairId = `${user1.email}|${user2.email}`;
    } else {
      pairId = `${user2.email}|${user1.email}`;
    }

    return pairId;
  } //createPairString

}