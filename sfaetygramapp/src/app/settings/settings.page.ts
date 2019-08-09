import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';

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
  constructor(
    public authService: AuthService,
    public menuService: MenuService,
    public formBuilder: FormBuilder
  ) {
    this.changePasswordGroup = this.formBuilder.group({
      password: [null, Validators.required],
      confirm_password: [null, [Validators.required, passwordConfirming]]
    });
  }

  ngOnInit() {
  }

  async changePW() {
    const password = this.changePasswordGroup.value.password;
    await this.authService.initPassword(password);
  }

}
