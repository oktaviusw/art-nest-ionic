import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Chat } from "../../models/chat";
import { User } from "../../models/user";
import { appconfig } from "../../app/app.config";
import { FirebaseProvider } from "../../providers/firebase";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";

@IonicPage()
@Component({
  selector: "page-chat-room",
  templateUrl: "chat-room.html"
})
export class ChatRoomPage implements OnInit {
  chats: any = [];
  chatpartner = this.firebaseProvider.currentChatPartner;
  chatuser: User;
  message: string;
  chatPayload: Chat;
  intervalScroll;
  @ViewChild("content") content: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: AngularFirestore,
    private firebaseProvider: FirebaseProvider,
    private storage: Storage
  ) {}

  //scrolls to bottom whenever the page has loaded
  ionViewDidEnter() {
    this.content.scrollToBottom(300); //300ms animation speed
  }

  ngOnInit() {

    this.storage.get("currentUser").then(currentUser => {
      let userCredential = JSON.parse(currentUser);
      this.chatuser = {
        email: userCredential.user.email,
        uID: userCredential.user.uID,
        username: userCredential.user.displayName,
        deviceID: '',
        time: new Date().getTime()
      };

      this.db
      .collection<Chat>(appconfig.chats_endpoint, res => {
        return res.where("pair", "==", this.firebaseProvider.currentChatPairId);
      })
      .valueChanges()
      .subscribe(chats => {
        
        this.chats = chats;
       
      });
    });
  } //ngOnInit

  addChat() {
    if (this.message && this.message !== "") {
      console.log(this.message);
      this.chatPayload = {
        message: this.message,
        sender: this.chatuser.email,
        pair: this.firebaseProvider.currentChatPairId,
        time: new Date().getTime()
      };

      this.firebaseProvider
        .addChat(this.chatPayload)
        .then(() => {
          //Clear message box
          this.message = "";

          //Scroll to bottom
          this.content.scrollToBottom(300);
        })
        .catch(err => {
          console.log(err);
        });
    }
  } //addChat

  isChatPartner(senderEmail) {
    return senderEmail == this.chatpartner.email;
  } //isChatPartner
}