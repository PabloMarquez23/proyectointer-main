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
    ButtonProvidersComponent,
  ],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export default class LogInComponent {
  hide = true;

  constructor() {}

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

  get isEmailInvalid(): boolean {
    const control = this.form.get('email');
    return !!control?.invalid && control.touched;
  }

  get isPasswordInvalid(): boolean {
    const control = this.form.get('password');
    return !!control?.invalid && control.touched;
  }

  getEmailErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('email')) {
      return 'Enter a valid email';
    }
    return '';
  }

  async logIn(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();  // Ensure all errors are displayed
      return;
    }

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
      if (this.isUserNotFoundError(error)) {
        this.openSnackBar('User not found, please register');
      } else {
        this.openSnackBar('An error occurred, please try again');
      }
    }
  }

  isUserNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      // Puedes ajustar esta lógica según cómo se manejan los mensajes de error en tu servicio de autenticación
      return error.message.includes('user-not-found');
    }
    return false;
  }

  openSnackBar(message: string = 'Successfully logged in'): any {
    return this._snackBar.open(message, 'Close', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
