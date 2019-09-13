import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';
import { MaterialModule } from 'src/app/material.module';
import { MessageComponent } from 'src/app/message/message.component';
import { ForwardinfoComponent } from 'src/app/message/forwardinfo/forwardinfo.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  declarations: [
    ChatPage,
    MessageComponent,
    ForwardinfoComponent
  ]
})
export class ChatPageModule {}
