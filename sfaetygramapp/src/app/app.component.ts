import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';

import { Platform, IonMenu, MenuController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuService } from './menu.service';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public hiddenSidebar = true;

  @ViewChild('main', { static: true })
  main: IonMenu;
  @ViewChild('snav', { static: false })
  snav: MatSidenav;


  public langs = [];

  mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public menuService: MenuService,
    public menu: MenuController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private translate: TranslateService
  ) {
    _('language.de');
    _('language.en');
  
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');
    this.langs = translate.getLangs();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.menuService.main = this.main;
      this.menuService.snav = this.snav;
      this.menuService.initWithChangeDetectors(changeDetectorRef, media);
    });
    // STANDARD
    this.http.get(`/api/interface/language`)
    .subscribe(async (res: string) => {
      this.translate.use(res);
    });
  }

  logout() {
    this.hiddenSidebar = true;
    this.authService.logout();
  }

  setLanguage(language: string) {
    this.translate.use(language);
    this.http.post(`/api/interface/language`, { lang: language,  })
    .subscribe(async (res: string) => {
    });
  }
}