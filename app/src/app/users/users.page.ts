import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MenuService } from '../menu.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  public users: any[];
  public filtered: any[];
  public searchTerm = '';

  constructor(
    public modalController: ModalController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public menuService: MenuService,
    private translate: TranslateService
  ) { }


  ngOnInit() {
    this.refreshData(null);
  }

  async refreshData(event) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('users.loadingUser'),
    });
    await loading.present();
    this.http.get(`/api/crest/users`).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe((res: any) => {
      if (!!res) {
        this.users = res;
        this.filter();
      }
      if (!!event) {
        event.target.complete();
      }
    });
  }
  assignCopy(){
    this.filtered = Object.assign([], this.users);
  }
  filter() {
    const term = this.searchTerm;
    if (!term) {
      this.assignCopy();
    }
    this.filtered = Object.assign([], this.users).filter(user => {
      return `${ user.usernamesets[0].firstName } ${ user.usernamesets[0].lastName } ${ user.usernamesets[0].username }`
        .toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

}