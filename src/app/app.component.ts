import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { bufferCount } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;

  message: string = "";
  showMessage: boolean = false;
  invalid: boolean = false;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required]],
      passwordCustomField: ['', [Validators.required]]
    });
  }

  ngAfterViewInit() {
    const form = document.getElementsByTagName('form');
    const source = fromEvent(form, 'submit');
    const bufferThree = source.pipe(bufferCount(3));
    const subscribe = bufferThree.subscribe(() => {
      this.form.controls['email'].disable();
      this.form.controls['passwordCustomField'].disable();
    });
  }

  onSubmit() {
    this.message = "";

    //Abort function if email is not conventional
    if (!this.validateEmail()) {
      this.messageControl("Email is broken!", true);
      return;
    }

    //check if data in form is valid, show simple messages
    if (this.form.valid) {
      this.messageControl("Form was successfully submitted.");
      this.saveEmailToLocalStorage();
    } else {
      this.messageControl("Invalid input!", true);
    }
  }

  messageControl(msg: string, err: boolean = false) {
    this.showMessage = true;

    if (err) {
      this.invalid = true;

    }

    this.message = msg;

    setTimeout(() => {
      this.showMessage = false;
      this.invalid = false;
    }, 2000);
  }

  validateEmail(): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.form.controls['email'].value).toLowerCase());
  }

  saveEmailToLocalStorage() {
    localStorage.setItem(Date.now().toString(), this.form.controls['email'].value);
  }
}
