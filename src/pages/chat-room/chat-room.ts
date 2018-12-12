import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Chat } from "../../models/chat";
import { User } from "../../models/user";
import { appconfig } from "../../app/app.config";
import { FirebaseProvider } from "../../providers/firebase";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { ImagePicker } from '@ionic-native/image-picker';
import { normalizeURL } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';


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
    private storage: Storage,
    private imagePicker: ImagePicker,
    private toastCtrl: ToastController,
    private base64: Base64,
    private camera: Camera,
    private photoViewer: PhotoViewer
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
        receiverID: this.chatpartner.deviceID,
        receiverEmail: this.chatpartner.email,
        pair: this.firebaseProvider.currentChatPairId,
        time: new Date().getTime(),
        type: 'message'
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

  addChatImage(imageUrl: string){
    this.chatPayload = {
      message: imageUrl,
      sender: this.chatuser.email,
      receiverID: this.chatpartner.deviceID,
      receiverEmail: this.chatpartner.email,
      pair: this.firebaseProvider.currentChatPairId,
      time: new Date().getTime(),
      type: 'picture'
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

  uploadImageToFirebase(image){
    this.firebaseProvider.uploadImage(image) 
      .then((imageUrl) => {
        this.addChatImage(imageUrl);
    })
  }

  getImage(){
    let settingImage = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    };

    const options: CameraOptions = settingImage;

    this.camera.getPicture(options).then((base64File) => {

      this.uploadImageToFirebase(base64File);

    });
  }

  showImage(url: string){
    this.photoViewer.show(url);
  }

  isChatPartner(senderEmail) {
    return senderEmail == this.chatpartner.email;
  } //isChatPartner
}