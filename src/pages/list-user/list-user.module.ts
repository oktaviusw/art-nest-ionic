import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListUserPage } from './list-user';

@NgModule({
  declarations: [
    ListUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ListUserPage),
  ],
})
export class ListUserPageModule {}
