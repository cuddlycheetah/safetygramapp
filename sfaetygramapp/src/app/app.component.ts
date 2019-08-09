import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';

import { Platform, IonMenu, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuService } from './menu.service';
import { MatSidenav } from '@angular/material';

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

  mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public menuService: MenuService,
    public menu: MenuController,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.menuService.main = this.main;
      this.menuService.snav = this.snav;
      console.log('snav', this.snav);
      this.menuService.initWithChangeDetectors(changeDetectorRef, media);
    });
  }

  logout() {
    this.hiddenSidebar = true;
    this.authService.logout();
  }
}
