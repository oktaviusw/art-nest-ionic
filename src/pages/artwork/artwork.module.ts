import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArtworkPage } from './artwork';

@NgModule({
  declarations: [
    ArtworkPage,
  ],
  imports: [
    IonicPageModule.forChild(ArtworkPage),
  ],
})
export class ArtworkPageModule {}
