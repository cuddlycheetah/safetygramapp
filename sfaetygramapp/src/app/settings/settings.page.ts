import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

function passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c) { return;}
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('confirm_password');

  if (!pwd || !cpwd) { return; }
  if (pwd.value !== cpwd.value) {
      return { invalid: true };
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  changePasswordGroup: FormGroup;
  changeBotTokenGroup: FormGroup;

  public dbStats = { fsSize: -1, };

  constructor(
    public authService: AuthService,
    public menuService: MenuService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {
    this.changePasswordGroup = this.formBuilder.group({
      password: [null, Validators.required],
      confirm_password: [null, [Validators.required, passwordConfirming]]
    });
    this.changeBotTokenGroup = this.formBuilder.group({
      botToken: [null, Validators.required],
    });
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('settings.bottoken.load'),
      translucent: true,
    });
    await loading.present();
    // STANDARD
    this.http.get(`/api/interface/bottoken`)
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(async (res: any) => {
      this.changeBotTokenGroup.setValue({ botToken: res });
    });

    // DB STATS
    this.http.get(`/api/v2/stats/db`)
    .subscribe(async (res: any) => {
      this.dbStats = res;
    });
  }

  async changePW() {
    const password = this.changePasswordGroup.value.password;
    await this.authService.initPassword(password);
  }
  async changeBT() {
    const botToken = this.changeBotTokenGroup.value.botToken;
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('settings.bottoken.set'),
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.post(`/api/interface/bottoken`, {
      botToken,
    })
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      async (res: any) => {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('settings.bottoken.success.alert.title'),
          message: undefined,
          buttons: ['OK'],
        });
        alert.present();
      }, async (err) => { // if the request fails, its propably because the server restarted
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('settings.bottoken.success.alert.title'),
          buttons: ['OK'],
        });
        alert.present();
    });
  }

}
