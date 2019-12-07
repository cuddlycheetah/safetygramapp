import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { forkJoin, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  id = '';
  basicUser: any = {};
  basicUserInfos: any[] = [];
  basicUserNamesets: any[] = [];
  basicChatNamesets: any[] = [];

  messages: any[] = [];
  public contextMenuMessage = {};

  private PAGE_SIZE = 50;
  selectedIndex = 0;
  messageCount = 0;
  cPage = 0;
  cachedData: Message[] = [];

  @ViewChild('scroll', { static: true })
  scroll: IonInfiniteScroll;

  constructor(
    private route: ActivatedRoute,
    public modalController: ModalController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public location: Location,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadBasicInfo();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.PAGE_SIZE);
  }
  public async loadPreviousPage() {
    return this.http.get(`/api/rest/message/@page/desc/${ this.id }/${ this.cPage++ }`)
    .subscribe((res: Message[]) => {
      this.scroll.disabled = res.length === 0;
      for (let message of res) {
        message.content = JSON.parse(message.content);
        this.cachedData.unshift(message);
      }
    });
  }
  formatDate (inputDate: Date) {
    const date = new Date(inputDate);
    return `${ date.toLocaleDateString() } ${ date.toLocaleTimeString() }`;
  }
  async loadBasicInfo() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('users.chat.loading'),
      translucent: true,
    });
    await loading.present();
    return forkJoin(
      [
        this.http.get(`/api/rest/user/${ this.id }`),
        this.http.get(`/api/rest/userinfo/desc?userId=${ this.id }`),
        this.http.get(`/api/rest/usernameset/desc?userId=${ this.id }`),
        this.http.get(`/api/rest/chatnameset/desc?chatId=${ this.id }`),
        this.http.get(`/api/rest/message/@count?chatId=${ this.id }`),
      ]
    )
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(async (res: any) => {
      this.basicUser = res[0];
      this.basicUserInfos = res[1];
      this.basicUserNamesets = res[2];
      this.basicChatNamesets = res[3];
      this.messageCount = res[4];
      this.loadPreviousPage();
      console.log('=> got response', res);
    });
  }
  async loadData(event) {
    event.target.disabled = true;
    await this.loadPreviousPage();

    event.target.complete();
    event.target.disabled = false;
  }

  menuOpened (message) {
    this.contextMenuMessage = message;
    console.log('context menu message=', message);
  }
  ctxMenu_OpenInTG() {
    // const url = `tg://openmessage?user_id=${ this.contextMenuMessage.chatId }&message_id=${ this.contextMenuMessage.id }`;
    // window.open(url);
  }
}
export interface Message {
  id: number;
  chatId: number;
  userId: number;
  senderChatId: number;

  isOutgoing: boolean;

  replyToMessageId: number;
  mediaAlbumId: string;

  isForwarded: boolean;
  forwardInfo: string;

  type: string;
  content: string;

  deleted: boolean;
  deletedAt: Date;
  createdAt: Date;

  hasEdits: boolean;
};
export interface MessageEdit {
  id: number;
  messageId: number;
  chatId: number;

  createdAt: Date;
  content: string;
}