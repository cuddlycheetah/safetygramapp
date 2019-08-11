import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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
  constructor(
    public authService: AuthService,
    public menuService: MenuService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
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
      message: 'Lade BotToken',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    return this.http.get(`/api/interface/bottoken`)
    .pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(async (res: any) => {
      this.changeBotTokenGroup.setValue({ botToken: res });
    });
  }

  async changePW() {
    const password = this.changePasswordGroup.value.password;
    await this.authService.initPassword(password);
  }
  async changeBT() {
    const botToken = this.changeBotTokenGroup.value.botToken;
    const loading = await this.loadingCtrl.create({
      message: 'Setze BotToken',
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
          header: 'Erfolgreich',
          message: undefined,
          buttons: ['OK'],
        });
        alert.present();
      }, async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Erfolgreich gesetzt',
          buttons: ['OK'],
        });
        alert.present();
    });
  }

}
