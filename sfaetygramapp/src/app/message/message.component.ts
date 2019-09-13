import { Component, OnInit, Input } from '@angular/core';
import { Message, MessageEdit } from '../users/chat/chat.page';
import { HttpClient } from '@angular/common/http';
import { MatMenu } from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  @Input()
  public message: Message;

  @Input()
  public menu: MatMenu;


  edits: MessageEdit[] = [];
  editsHidden = true;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {}

  toggleEdits () {
    if (this.message.hasEdits) {
      if (this.edits.length === 0) {
        return this.http.get(`/api/rest/messageedit/?messageId=${ this.message.id }`)
        .subscribe((res: MessageEdit[]) => {
          console.log('res', res.length);
          this.edits = res;
        });
      }
      this.editsHidden = !this.editsHidden;
    }
  }
  formatDate (inputDate: Date) {
    const date = new Date(inputDate);
    return `${ date.toLocaleDateString() } ${ date.toLocaleTimeString() }`;
  }
}
