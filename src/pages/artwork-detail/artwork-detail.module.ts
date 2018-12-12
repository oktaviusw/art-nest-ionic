import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArtworkDetailPage } from './artwork-detail';

@NgModule({
  declarations: [
    ArtworkDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ArtworkDetailPage),
  ],
})
export class ArtworkDetailPageModule {}
