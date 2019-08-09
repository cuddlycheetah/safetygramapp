import { Component } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public menuService: MenuService
  ) {}

}
