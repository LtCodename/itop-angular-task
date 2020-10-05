import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, from } from 'rxjs';
import { bufferCount, filter } from 'rxjs/operators';

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
    //RxJS: Task 5
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

    //RxJS: Task 4
    const emailSource = from([this.form.controls['email'].value]);
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const ex = emailSource.pipe(filter(mail => re.test(String(mail).toLowerCase())));
    const sub = ex.subscribe(val => localStorage.setItem(Date.now().toString(), val));

    //check if data in form is valid, show simple messages
    if (this.form.valid) {
      this.messageControl("Form was successfully submitted.");
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
}
