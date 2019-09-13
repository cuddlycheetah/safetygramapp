import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'forward-info',
  templateUrl: './forwardinfo.component.html',
  styleUrls: ['./forwardinfo.component.scss'],
})
export class ForwardinfoComponent implements OnInit {

  @Input()
  public message;

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit() {}

  getForwardText() {
    let text = '';
    /*
      fordwardName: ""
      forwardInfo: null
      forwardType: null
      forwardedChat: -1001211391560
      forwardedUser: null
    */
    if (!!this.message.forwardedChat) {
      text = `${ this.translate.instant('chat.message.forwardinfo.chat') } `;
    }
    if (!!this.message.forwardedUser) {
      text = `${ this.translate.instant('chat.message.forwardinfo.user') } `;
    }
    return text;
  }
}
