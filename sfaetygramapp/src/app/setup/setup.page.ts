import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatVerticalStepper } from '@angular/material';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {

  // @ViewChild('stepper', {static: true}) stepper: MatVerticalStepper;

  // @ViewChild('phoneNumberStep', {static: true}) phoneNumberStep: MatStep;
  // @ViewChild('codeStep', {static: true}) codeStep: MatStep;

  paneIndex = -1;

  phoneNumberGroup: FormGroup;
  codeGroup: FormGroup;
  passwordGroup: FormGroup;
  interfacePasswordGroup: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.phoneNumberGroup = this.formBuilder.group({
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      ]],
    });
    this.codeGroup = this.formBuilder.group({
      code: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ]],
    });
    this.passwordGroup = this.formBuilder.group({
      password: ['', Validators.required],
    });
    this.interfacePasswordGroup = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  async verifyPhoneNumber() {
    if (this.phoneNumberGroup.invalid) { return false; }
    const phoneNumber = this.phoneNumberGroup.value.phoneNumber;
    await this.authService.verifyPhoneNumber(phoneNumber);
  }
  async verifyCode() {
    if (this.codeGroup.invalid) { return false; }
    const code = this.codeGroup.value.code;
    await this.authService.verifyCode(code);
  }
  async verifyPassword() {
    if (this.passwordGroup.invalid) { return false; }
    const password = this.passwordGroup.value.password;
    await this.authService.verifyPassword(password);
  }
  async finishSetup() {
    if (this.interfacePasswordGroup.invalid) { return false; }
    const password = this.interfacePasswordGroup.value.password;
    await this.authService.initPassword(password);
  }
  async ngOnInit() {
    if (this.authService.setupNavOkay.value === false) {
      this.router.navigateByUrl('/');
    }
    this.authService.tgAuthState.subscribe((newState) => {
      console.log('tgAuth State', newState);
      switch (newState) {
        case 'authorizationStateWaitPhoneNumber':
          this.paneIndex = 0;
          break;
          case 'authorizationStateWaitCode':
            this.paneIndex = 1;
            break;
          case 'authorizationStateWaitPassword':
            this.paneIndex = 2;
            break;
          case 'authorizationStateReady':
            this.paneIndex = 3;
            break;
        default:
          console.warn('unkown tgAuth State', newState);
          break;
      }
    });
  }
}
