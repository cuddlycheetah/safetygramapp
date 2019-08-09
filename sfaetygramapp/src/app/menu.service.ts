import { Injectable, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { IonMenu } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnDestroy {

  mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;
  main: IonMenu;
  public snav: MatSidenav;

  constructor () { 
    this.mobileQuery = { matches: false } as MediaQueryList;
  }
  initWithChangeDetectors(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1080px)');
    this.mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      console.log(this.mobileQuery.matches);
      if (!this.mobileQuery.matches) { // Wide
        // this.main.open();
        // this.menu.enable(false, 'main');
      } else { // Narrow
        // this.menu.enable(true, 'main');
        // this.main.close();
      }
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }
  toggle () {
    this.snav.toggle();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
