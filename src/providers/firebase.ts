import { Injectable } from '@angular/core';

import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCtnhjQCrEh8yeXjrZXpZhPjNLH7XeAuPA",
    authDomain: "artnest-ca0ef.firebaseapp.com",
    databaseURL: "https://artnest-ca0ef.firebaseio.com",
    projectId: "artnest-ca0ef",
    storageBucket: "artnest-ca0ef.appspot.com",
    messagingSenderId: "1082674931088"
    };
firebase.initializeApp(firebaseConfig);
 
@Injectable()
export class FirebaseProvider {
  constructor() {

  }

  registerToken(token){
    let db = firebase.firestore();
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
}