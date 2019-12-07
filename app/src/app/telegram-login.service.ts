import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramLoginService {

  constructor(
    public ngZone: NgZone
  ) { }

  init() {
    window['loginViaTelegram'] = loginData => this.loginViaTelegram(loginData);
  }

  private loginViaTelegram(loginData: any) {
    this.ngZone.run(() => {
      console.log(loginData);
    });
  }
}