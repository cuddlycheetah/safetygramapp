import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public loginFormGroup: FormGroup;
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder
  ) {
    this.loginFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.authService.getStatus();
  }
  login() {
    const password = this.loginFormGroup.value.password;
    this.authService.login(password);
  }
}
