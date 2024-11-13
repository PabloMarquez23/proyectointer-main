import { Component, inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Credential } from '../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonProvidersComponent } from '../components/button-providers/button-providers.component';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';

interface SignUpForm {
  names: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<'visitor' | 'admin'>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOption,
    RouterModule,
    ButtonProvidersComponent,
    NgIf,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent {
  hide = true;

  formBuilder = inject(FormBuilder);
  form: FormGroup<SignUpForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    role: this.formBuilder.control('visitor' as 'visitor' | 'admin', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  private authService = inject(AuthService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    const isInvalid = control?.invalid && control.touched;
    if (isInvalid) {
      return control.hasError('required') ? 'This field is required' : 'Enter a valid email';
    }
    return false;
  }

  async signUp(): Promise<void> {
    if (this.form.invalid) return;
  
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    const role = this.form.value.role ?? 'visitor'; // Asegura que role nunca sea undefined
  
    const additionalData = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      email: this.form.value.email
    };
  
    try {
      await this.authService.signUpWithEmailAndPassword(credential, role, additionalData);
  
      const snackBarRef = this.openSnackBar();
      snackBarRef.afterDismissed().subscribe(() => {
        this._router.navigateByUrl('/');
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  

  openSnackBar() {
    return this._snackBar.open('Successfully Signed Up 😀', 'Close', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}