import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { BehaviorSubject } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  setupNavOkay = new BehaviorSubject(false);

  freshToken = new BehaviorSubject('');
  tgAuthState = new BehaviorSubject('');
  authSubject = new BehaviorSubject(false);
  updateAvailableSubject = new BehaviorSubject(false);
  tokenValidationFailed = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private translate: TranslateService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService
  ) { }
  async init() {
  }
  async checkLocalStorageToken() {
    if (!this.storage.get('ACCESS_TOKEN')) {
      this.tokenValidationFailed.next(true);
      return; // * Dont Check if we dont have an Access Token
    }
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('auth.checklocalstorage'), //marker('auth.checklocalstorage'),
      translucent: true,
    });
    await loading.present();
    // STANDARD
    this.http.get('/api/token/check').pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe((res: any) => {
      if (!!res) {
        console.log('validated token', res);
        // this.loggedInMitarbeiter.next(res as MitarbeiterLocal);
        this.authSubject.next(true);
        this.router.navigate(['home']);
      }
    }, () => {
      this.tokenValidationFailed.next(true);
      this.logout();
    });
  }
  async getStatus() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('auth.gatheringconfig'),
      translucent: true,
    });
    await loading.present();
    // STANDARD
    this.http.get('/api/status').pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe((res: any) => {
      this.tgAuthState.next(res.tgAuth);
      this.updateAvailableSubject.next(res.updateAvailable);
      if (!!res.setup) {
        this.setupNavOkay.next(true);
        this.router.navigate(['setup']);
      } else {
        this.setupNavOkay.next(false);
        this.checkLocalStorageToken();
      }
    });
  }


  async verifyPhoneNumber(phoneNumber) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('setup.verify.phonenumber'), //'Bestätige Telefonnummer',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.post(`/api/setup/phonenumber`, {
      phoneNumber,
    }).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
      console.log(res);
      this.tgAuthState.next(res);
    }, async (err) => {
      console.error('oopsie happened', err);
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('setup.invalid.phonenumber'),
        message: err || 'invalid',
        buttons: ['OK'],
      });
      alert.present();
    });
  }
  async verifyPassword(password) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('setup.verify.password'), // 'Bestätige Passwort',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.post(`/api/setup/password`, {
      password,
    }).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
      console.log(res);
      this.tgAuthState.next(res);
    }, async (err) => {
      console.error('oopsie happened', err);
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('setup.invalid.password'),
        message: err || 'invalid',
        buttons: ['OK'],
      });
      alert.present();
    });
  }
  async verifyCode(code) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('setup.verify.code'), // 'Bestätige Code',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.post(`/api/setup/code`, {
      code,
    }).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
      console.log(res);
      this.tgAuthState.next(res);
    }, async (err) => {
      console.error('oopsie happened', err);
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('setup.invalid.code'),
        message: err || 'invalid',
        buttons: ['OK'],
      });
      alert.present();
    });
  }

  async initPassword(password) {
    const loading = await this.loadingCtrl.create({
      message: 'Setze Passwort',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.post(`/api/interface/changepassword`, {
      password,
    })
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
        console.log(res);
        await this.logout();
      }, async (err) => {
        console.error('oopsie happened', err);
        const alert = await this.alertCtrl.create({
          header: 'Password invalid',
          message: err || 'invalid',
          buttons: ['OK'],
        });
        alert.present();
    });
  }
  async login(password) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('auth.loggingin'),
      translucent: true,
    });
    await loading.present();
    return this.http.post(`/api/login`, {
      password,
    })
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
        console.log('=> got response');
        if (!!res) {
          console.log('login success');
          await this.storage.set('ACCESS_TOKEN', res);
          // await this.storage.set('EXPIRES_IN', res.expires);
          this.authSubject.next(true);
          this.router.navigate(['home']);
        }
      }, async (err) => {
        console.error('oopsie happened', err);
        const alert = await this.alertCtrl.create({
          header: 'Login failed',
          message: err,
          buttons: ['OK'],
        });
        alert.present();
    });
  }





  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('EXPIRES_IN');
    this.authSubject.next(false);
    this.setupNavOkay.next(false);
    // this.loggedInMitarbeiter.next(undefined);
    this.tokenValidationFailed.next(true);
    this.router.navigate(['auth']);
  }
  isAuthenticated() {
    return this.authSubject.value;
  }
  hasTokenValidationFailed() {
    return this.tokenValidationFailed.value;
  }
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
