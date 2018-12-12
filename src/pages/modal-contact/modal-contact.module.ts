import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalContactPage } from './modal-contact';

@NgModule({
  declarations: [
    ModalContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalContactPage),
  ],
})
export class ModalContactPageModule {}
