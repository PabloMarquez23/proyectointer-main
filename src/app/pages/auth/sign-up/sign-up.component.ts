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

// Define la estructura del formulario de registro con campos específicos
interface SignUpForm {
  names: FormControl<string>; // Campo para el nombre del usuario
  lastName: FormControl<string>; // Campo para el apellido del usuario
  email: FormControl<string>; // Campo para el correo electrónico del usuario
  password: FormControl<string>; // Campo para la contraseña del usuario
  role: FormControl<'visitor' | 'admin'>; // Campo para el rol del usuario (visitante o administrador)
}

@Component({
  selector: 'app-sign-up', // Selector utilizado para incluir el componente en plantillas
  standalone: true, // Permite que el componente sea independiente y no dependa de un módulo
  imports: [
    MatFormFieldModule, // Módulo para manejar campos de formulario de Angular Material
    MatInputModule, // Módulo para entradas de texto de Angular Material
    MatIconModule, // Módulo para íconos de Angular Material
    MatButtonModule, // Módulo para botones de Angular Material
    ReactiveFormsModule, // Módulo para manejar formularios reactivos
    MatOption, // Módulo para opciones de selección
    RouterModule, // Módulo para la navegación y rutas
    ButtonProvidersComponent, // Componente reutilizable para botones de proveedores de autenticación
    NgIf, // Directiva para condicionales en plantillas
  ],
  templateUrl: './sign-up.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./sign-up.component.scss'], // Ruta al archivo de estilos SCSS
})
export default class SignUpComponent {
  // Propiedad para controlar si la contraseña es visible o está oculta
  hide = true;

  // Inyección de FormBuilder para construir el formulario reactivo
  formBuilder = inject(FormBuilder);

  // Declaración del formulario reactivo y sus validadores
  form: FormGroup<SignUpForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required, // Validador: Campo obligatorio
      nonNullable: true, // Evita valores nulos en el campo
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required, // Validador: Campo obligatorio
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email], // Validadores: Obligatorio y formato de correo
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)], // Validadores: Obligatorio y longitud mínima de 6 caracteres
      nonNullable: true,
    }),
    role: this.formBuilder.control('visitor' as 'visitor' | 'admin', {
      validators: Validators.required, // Validador: Campo obligatorio
      nonNullable: true,
    }),
  });

  // Inyección de dependencias necesarias para la funcionalidad del componente
  private authService = inject(AuthService); // Servicio de autenticación
  private _router = inject(Router); // Servicio de enrutamiento
  private _snackBar = inject(MatSnackBar); // Servicio para mostrar mensajes emergentes

  // Métodos para obtener mensajes de error personalizados para cada campo
  get namesErrorMessage(): string {
    const control = this.form.get('names');
    if (control?.hasError('required')) {
      return 'El campo "Nombre" es obligatorio.'; // Mensaje si el campo está vacío
    }
    return '';
  }

  get lastNameErrorMessage(): string {
    const control = this.form.get('lastName');
    if (control?.hasError('required')) {
      return 'El campo "Apellido" es obligatorio.'; // Mensaje si el campo está vacío
    }
    return '';
  }

  get emailErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'El campo "Correo electrónico" es obligatorio.'; // Mensaje si el campo está vacío
    }
    if (control?.hasError('email')) {
      return 'Ingrese un correo electrónico válido.'; // Mensaje si el formato es incorrecto
    }
    return '';
  }

  get passwordErrorMessage(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) {
      return 'El campo "Contraseña" es obligatorio.'; // Mensaje si el campo está vacío
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.'; // Mensaje si la contraseña es muy corta
    }
    return '';
  }

  // Método para registrar al usuario
  async signUp(): Promise<void> {
    if (this.form.invalid) {
      // Si el formulario es inválido, muestra un mensaje de error
      this.openSnackBar('Por favor, complete todos los campos correctamente antes de continuar.', 'Cerrar');
      return;
    }

    // Preparar las credenciales y los datos adicionales para el registro
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    const role = this.form.value.role ?? 'visitor'; // Asignar un rol por defecto si no está presente
    const additionalData = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
    };

    try {
      // Llamar al servicio de autenticación para registrar al usuario
      await this.authService.signUpWithEmailAndPassword(credential, role, additionalData);
      // Mostrar mensaje de éxito y redirigir a la página principal
      this.openSnackBar('Perfil creado con éxito.', 'Cerrar');
      this._router.navigateByUrl('/');
    } catch (error) {
      console.error(error);
      // Mostrar mensaje de error si el registro falla
      this.openSnackBar('Error al crear el perfil. Intente nuevamente.', 'Cerrar');
    }
  }

  // Método para mostrar mensajes emergentes
  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 2500, // Duración del mensaje en milisegundos
      verticalPosition: 'top', // Posición vertical en la parte superior
      horizontalPosition: 'end', // Posición horizontal al final
    });
  }
}
