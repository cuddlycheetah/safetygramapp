import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuService } from '../menu.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  constructor(
    public authService: AuthService,
    public menuService: MenuService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  async checkForUpdates () {
    const loading = await this.loadingCtrl.create({
      message: 'Gathering Config',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    this.http.get('/api/status').pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe((res: any) => {
      // this.authService.updateAvailableSubject.next(res.updateAvailable);
    });
  }

  async restartServer () {
    const loading = await this.loadingCtrl.create({
      message: 'Restarting Safetygram',
      translucent: true,
    });
    await loading.present();
    // STANDARD
    this.http.post('/api/server/restart', null).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe((res: any) => {

    });
  }
}
