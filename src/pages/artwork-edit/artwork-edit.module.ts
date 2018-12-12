import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArtworkEditPage } from './artwork-edit';

@NgModule({
  declarations: [
    ArtworkEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ArtworkEditPage),
  ],
})
export class ArtworkEditPageModule {}
