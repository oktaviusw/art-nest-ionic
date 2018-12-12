import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'rxjs/add/operator/toPromise';
import { AngularFireStorage } from "@angular/fire/storage";

import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { appconfig } from "../app/app.config";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Notification } from "../models/notification";

import { Storage } from "@ionic/storage";

import { AlertController, Events, ToastController } from "ionic-angular";
import { Firebase } from '@ionic-native/firebase';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
 
@Injectable()
export class FirebaseProvider {

  currentUser: firebase.auth.UserCredential;

  users: AngularFirestoreCollection<User>;

  chats: AngularFirestoreCollection<Chat>;

  notifications: AngularFirestoreCollection<Notification>;

  //The pair string for the two users currently chatting
  currentChatPairId;
  currentChatPartner;

  constructor(
    public db: AngularFirestore, 
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public events: Events,
    public firebase2: Firebase,
    public afStorage: AngularFireStorage) 
    {
    this.users = db.collection<User>(appconfig.users_endpoint);
    this.chats = db.collection<Chat>(appconfig.chats_endpoint);
    this.notifications = db.collection<Notification>(appconfig.notification_endpoint);

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

        loginUser.user.updateProfile({
          displayName: loginUser.user.displayName,
          photoURL: `https://artnest-umn.000webhostapp.com/assets/userdata/${email}/ProfilePicture.png`
        }).then(() => {
          this.events.publish('user:changeDisplayName', loginUser.user.displayName, loginUser.user.email, loginUser.user.photoURL);
          this.currentUser = loginUser;
          this.storage.set('currentUser', JSON.stringify(loginUser));
          this.updateToken();
        })
      });
  }

  async signupUser(email: string, username: string, password: string): Promise<any> {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then( newUser => {
            newUser.user.updateProfile({
              displayName: username,
              photoURL: `https://artnest-umn.000webhostapp.com/assets/userdata/${email}/ProfilePicture.png`
            });
            this.firebase2.getToken()
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

  addNotification(title: string, message: string, receiverEmail: string){
    const notification: Notification = {
      title: title,
      message: message,
      receiverEmail: receiverEmail
    }
    return this.notifications.add(notification);
  }

  createPairId(user1, user2) {
    let pairId;
    if (user1.email < user2.email) {
      pairId = `${user1.email}|${user2.email}`;
    } else {
      pairId = `${user2.email}|${user1.email}`;
    }

    return pairId;
  } //createPairString

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  b64toBlob(b64Data, contentType):Blob {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
   
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
   
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
   
      var byteArray = new Uint8Array(byteNumbers);
   
      byteArrays.push(byteArray);
    }
   
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  uploadImage(image64){
    let newName = new Date().getTime();
    return new Promise<any>((resolve) => {

      let downloadURL = new Observable<any>();
      
      let imageBlob = this.b64toBlob(image64, "image/jpeg");
      const ref = this.afStorage.ref(`images/${newName}`)
      const task = ref.put(imageBlob).then(savedPictures => {

        ref.getDownloadURL().subscribe(url => {
          resolve(url);
        })
      })
      .catch(err => {
        let alert = this.alertCtrl.create({
          title: 'Error Upload Image Provider',
          subTitle: err.message,
          buttons: [
            {
              text: "OK"
            }
          ]
        });
        alert.present();
      })
    })
  }

  updateToken(){
    // firebase.auth().currentUser.getIdToken(true)
    // firebase.auth().currentUser.getIdToken()
    this.firebase2.getToken()
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