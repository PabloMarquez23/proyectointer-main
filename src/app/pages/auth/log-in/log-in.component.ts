import { Component, inject } from '@angular/core';


import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService, Credential } from '../../../core/services/auth.service';
import { ButtonProvidersComponent } from '../components/button-providers/button-providers.component';



interface LogInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    MatSnackBarModule,
    ButtonProvidersComponent



  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export default class LogInComponent  {


  hide = true;
  constructor(){}


  formBuilder = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  private _snackBar = inject(MatSnackBar);

  form: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid email';
    }

    return false;
  }

  async logIn(): Promise<void> {
    if (this.form.invalid) return;

    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    try {
      await this.authService.logInWithEmailAndPassword(credential);
      const snackBarRef = this.openSnackBar();

      snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigateByUrl('/');
      });
    } catch (error) {
      console.error(error);
    }
  }

  openSnackBar() {
    return this._snackBar.open('Succesfully Log in ', 'Close', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}