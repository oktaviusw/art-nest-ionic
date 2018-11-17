import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOrderPage } from './modal-order';

@NgModule({
  declarations: [
    ModalOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOrderPage),
  ],
})
export class ModalOrderPageModule {}
