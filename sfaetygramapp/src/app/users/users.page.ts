import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MenuService } from '../menu.service';

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
    public menuService: MenuService
  ) { }


  ngOnInit() {
    this.refreshData(null);
  }

  async refreshData(event) {
    // dataMitarbeiter;
    const loading = await this.loadingCtrl.create({
      message: 'Lade User',
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