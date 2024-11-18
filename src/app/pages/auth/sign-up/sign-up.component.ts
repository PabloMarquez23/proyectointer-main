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
      validators: [Validators.required, Validators.minLength(6)],
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

  // Métodos de validación con mensajes específicos para cada campo

  get namesErrorMessage(): string {
    const control = this.form.get('names');
    if (control?.hasError('required')) {
      return 'El campo "Nombre" es obligatorio.';
    }
    return '';
  }

  get lastNameErrorMessage(): string {
    const control = this.form.get('lastName');
    if (control?.hasError('required')) {
      return 'El campo "Apellido" es obligatorio.';
    }
    return '';
  }

  get emailErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'El campo "Correo electrónico" es obligatorio.';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un correo electrónico válido.';
    }
    return '';
  }

  get passwordErrorMessage(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) {
      return 'El campo "Contraseña" es obligatorio.';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  }

  async signUp(): Promise<void> {
    if (this.form.invalid) {
      this.openSnackBar('Por favor, complete todos los campos correctamente antes de continuar.', 'Cerrar');
      return;
    }
  
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    const role = this.form.value.role ?? 'visitor';
  
    const additionalData = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      email: this.form.value.email
    };
  
    try {
      await this.authService.signUpWithEmailAndPassword(credential, role, additionalData);
      this.openSnackBar('Perfil creado con éxito.', 'Cerrar');
      this._router.navigateByUrl('/');
    } catch (error) {
      console.error(error);
      this.openSnackBar('Error al crear el perfil. Intente nuevamente.', 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
