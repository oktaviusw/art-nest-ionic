import { Injectable } from '@angular/core';

import firebase from 'firebase';
import 'firebase/firestore';

import { FCM } from '@ionic-native/fcm';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { appconfig } from "../app/app.config";
import { Chat } from "../models/chat";
import { User } from "../models/user";

import { Storage } from "@ionic/storage";

import { AlertController, Events } from "ionic-angular";
import { Firebase } from '@ionic-native/firebase';
import { query } from '@angular/core/src/render3/instructions';
 
@Injectable()
export class FirebaseProvider {

  currentUser: firebase.auth.UserCredential;

  users: AngularFirestoreCollection<User>;

  chats: AngularFirestoreCollection<Chat>;

  //The pair string for the two users currently chatting
  currentChatPairId;
  currentChatPartner;

  constructor(
    public db: AngularFirestore, 
    public storage: Storage,
    public alertCtrl: AlertController,
    public events: Events,
    public fcm: FCM,
    public firebase2: Firebase) 
    {
    this.users = db.collection<User>(appconfig.users_endpoint);
    this.chats = db.collection<Chat>(appconfig.chats_endpoint);

    this.storage.get('currentUser')
    .then(currentUser => {
      let userCredential:firebase.auth.UserCredential = JSON.parse(currentUser);
      if(userCredential != null){
        this.currentUser = userCredential;
      }
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(loginUser => {
        this.events.publish('user:changeDisplayName', loginUser.user.displayName, loginUser.user.email);
        this.currentUser = loginUser;
        this.storage.set('currentUser', JSON.stringify(loginUser));

        
          this.updateToken();

      });
  }

  async signupUser(email: string, username: string, password: string): Promise<any> {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then( newUser => {
            newUser.user.updateProfile({
              displayName: username,
              photoURL: 'test'
            });
            this.fcm.getToken()
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
                      text: "OK"
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
                  text: "OK"
                }
              ]
            });
            alert.present();
          }
          )
        });
  }

  setUser(currentUser: firebase.auth.UserCredential){
    this.currentUser = currentUser;
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

  updateToken(){
    // firebase.auth().currentUser.getIdToken(true)
    // firebase.auth().currentUser.getIdToken()
    // this.firebase2.getToken()
    this.fcm.getToken()
      .then(token => {
          firebase.firestore().collection(appconfig.users_endpoint)
          .where("uID", "==", firebase.auth().currentUser.uid)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach(doc => {
                this.db.collection(appconfig.users_endpoint)
                .doc(doc.id)
                .update({
                  deviceID: token
                }).then(() => {
                  let alert = this.alertCtrl.create({
                    title: 'Update Token Firebase',
                    subTitle: token,
                    buttons: [
                      {
                        text: "OK"
                      }
                    ]
                  });
                  alert.present();
                })
                .catch(error => {
                  let alert = this.alertCtrl.create({
                    title: 'Error Message 1',
                    subTitle: error.message,
                    buttons: [
                      {
                        text: "OK"
                      }
                    ]
                  });
                  alert.present();
                })
              })
            })
            .catch(error => {
              let alert = this.alertCtrl.create({
                title: 'Error Message 2',
                subTitle: error.message,
                buttons: [
                  {
                    text: "OK"
                  }
                ]
              });
              alert.present();
            })
      })
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: 'Error Message 3',
          subTitle: error.message,
          buttons: [
            {
              text: "OK"
            }
          ]
        });
        alert.present();
      })
  }
}