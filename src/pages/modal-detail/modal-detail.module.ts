import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDetailPage } from './modal-detail';

@NgModule({
  declarations: [
    ModalDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDetailPage),
  ],
})
export class ModalDetailPageModule {}
