import { Injectable } from '@angular/core';

import firebase from 'firebase';
import 'firebase/firestore';
import { NavController } from 'ionic-angular';

import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home'

const firebaseConfig = {
    apiKey: "AIzaSyCtnhjQCrEh8yeXjrZXpZhPjNLH7XeAuPA",
    authDomain: "artnest-ca0ef.firebaseapp.com",
    databaseURL: "https://artnest-ca0ef.firebaseio.com",
    projectId: "artnest-ca0ef",
    storageBucket: "artnest-ca0ef.appspot.com",
    messagingSenderId: "1082674931088"
    };
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
 
@Injectable()
export class FirebaseProvider {
  
  constructor() {

  }

  getFirebase(){
    return firebase;
  }

  registerToken(token){
    db.collection('devices').where("token", "==", token)
      .get()
      .then(function(querySnapshot){
        // querySnapshot.forEach(function(doc){
        // });
        
        //ngecek apakah sudah ada atau belum
        if(querySnapshot.size == 0){
          //nambahin ke firestore kalau belum ada
          db.collection('devices').add({
            token: token,
            userId: '1'
          });
        //   .then(
        //     (data) =>{
        //       alert('Firestore added the id is : '+ data.id);
        //   }).catch(
        //     (error) => {
        //       alert("Error : " + error);
        //     }
        //   )
        }
      })
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(username: string, email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then( newUser => {
        // firebase
        // .database()
        // .ref('/userProfile')
        // .child(newUser.uid)
        // .set({ email: email });
        db.collection('users').add({
          username: username,
          email: email,
          uID: newUser.user.uid
        });
      });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}