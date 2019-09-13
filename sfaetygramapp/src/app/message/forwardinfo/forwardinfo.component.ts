import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'forward-info',
  templateUrl: './forwardinfo.component.html',
  styleUrls: ['./forwardinfo.component.scss'],
})
export class ForwardinfoComponent implements OnInit {

  @Input()
  public message;

  public text = 'Unkown';
  constructor(
    public translate: TranslateService,
    public http: HttpClient
  ) { }

  ngOnInit() {
    /*
      fordwardName: ""
      forwardInfo: null
      forwardType: null
      forwardedChat: -1001211391560
      forwardedUser: null
    */
   const peerId = !!this.message.forwardedUser ? this.message.forwardedUser : this.message.forwardedChat;

   this.http.get(`/api/rest/chatnameset/desc?chatId=${ peerId }`)
   .subscribe((data: any) => {
    const peerName = !!this.message.fordwardName && this.message.fordwardName.length > 0
      ? this.message.fordwardName
      : data[0].name;

    if (!!this.message.forwardedChat) {
      this.text = `${ this.translate.instant('chat.message.forwardinfo.chat') } ${ peerName }`;
    }
    if (!!this.message.forwardedUser) {
      this.text = `${ this.translate.instant('chat.message.forwardinfo.user') } ${ peerName }`;
    }
   });
  }

}
