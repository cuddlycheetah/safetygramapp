import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { forkJoin, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  id = '';
  basicUser: any;
  basicUserInfos: any[];
  basicUserNamesets: any[];
  messages: any[];
  private PAGE_SIZE = 50;

  private cachedData: Message[] = [];

  @ViewChild('scroll', { static: true })
  scroll: IonInfiniteScroll;

  constructor(
    private route: ActivatedRoute,
    public modalController: ModalController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private location: Location,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadBasicInfo();
    this.loadPreviousPage();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.PAGE_SIZE);
  }
  public loadPreviousPage() {
    const cPage = this.getPageForIndex(this.cachedData.length + 1);
    return this.http.get(`/api/rest/message/@page/${ this.id }/${ cPage }`)
    .subscribe((res: Message[]) => {
      console.log('res', res.length);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < res.length; i++) {
        const j = (res.length - 1) - i;
        res[j].content = JSON.parse(res[j].content);
        this.cachedData.unshift(res[j]);
      }
      this.scroll.disabled = res.length < this.PAGE_SIZE;
      console.log(this.cachedData);
    });
  }
  async loadBasicInfo() {
    const loading = await this.loadingCtrl.create({
      message: 'Lade User',
      translucent: true,
    });
    // http://farnox.umann.it:46590/api/rest/message/@count?chatId=213676321
    await loading.present();
    return forkJoin(
      [
        this.http.get(`/api/rest/user/${ this.id }`),
        this.http.get(`/api/rest/userinfo/?userId=${ this.id }`),
        this.http.get(`/api/rest/usernameset/?userId=${ this.id }`),
      ]
    )
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(async (res: any) => {
      this.basicUser = res[0];
      this.basicUserInfos = res[1];
      this.basicUserNamesets = res[2];
      console.log('=> got response', res);
    });
  }
  async loadData(event) {
    this.loadPreviousPage();
    event.target.complete();
    // event.target.disabled = true;
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
  // forwardInfo: string;

  type: string;
  content: string;

  deleted: boolean;
  deletedAt: Date;

  hasEdits: boolean;
};