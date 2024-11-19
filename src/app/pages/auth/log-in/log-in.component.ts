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
import { MensajeService } from '../../../services/mensaje.service';

// Interfaz para tipar el formulario de inicio de sesión
interface LogInForm {
  email: FormControl<string>; // Campo de correo electrónico
  password: FormControl<string>; // Campo de contraseña
}

@Component({
  selector: 'app-log-in',
  standalone: true, // Permite que el componente sea independiente de módulos globales
  imports: [
    MatFormFieldModule, // Modulo de Angular Material para campos de formulario
    MatInputModule,     // Módulo de entrada de texto
    MatIconModule,      // Módulo para iconos
    MatButtonModule,    // Botones estilizados
    ReactiveFormsModule, // Módulo de formularios reactivos
    RouterModule,        // Módulo para navegación
    NgIf,                // Directiva condicional
    MatSnackBarModule,   // Módulo para notificaciones
    ButtonProvidersComponent, // Componente reutilizable para botones de proveedores
  ],
  templateUrl: './log-in.component.html', // Ruta de la plantilla HTML
  styleUrls: ['./log-in.component.scss'], // Ruta de los estilos
})
export default class LogInComponent {
  hide = true; // Controla la visibilidad de la contraseña

  constructor() {}

  // Inyecciones de servicios necesarios
  formBuilder = inject(FormBuilder); // Para construir formularios reactivos
  private authService = inject(AuthService); // Servicio de autenticación
  private mensajeService = inject(MensajeService); // Servicio para consultar datos de usuarios
  private router = inject(Router); // Servicio para navegación
  private _snackBar = inject(MatSnackBar); // Servicio para mostrar notificaciones

  // Configuración del formulario reactivo
  form: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email], // Validaciones para el correo
      nonNullable: true, // Asegura que el valor no sea nulo
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required], // Validación de campo obligatorio
      nonNullable: true,
    }),
  });

  // Propiedad calculada para verificar si el correo es inválido
  get isEmailInvalid(): boolean {
    const control = this.form.get('email');
    return !!control?.invalid && control.touched;
  }

  // Propiedad calculada para verificar si la contraseña es inválida
  get isPasswordInvalid(): boolean {
    const control = this.form.get('password');
    return !!control?.invalid && control.touched;
  }

  // Mensajes de error personalizados para el campo de correo electrónico
  getEmailErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'This field is required'; // Mensaje para campo vacío
    } else if (control?.hasError('email')) {
      return 'Enter a valid email'; // Mensaje para formato inválido
    }
    return '';
  }

  /**
   * Método para manejar el inicio de sesión
   */
  async logIn(): Promise<void> {
    // Si el formulario es inválido, marca todos los campos como tocados y detiene el proceso
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Creación del objeto con las credenciales del usuario
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    try {
      // Verificar si el usuario existe en Firestore
      const userExists = await this.doesUserExist(credential.email);

      if (!userExists) {
        // Mostrar notificación si el usuario no está registrado
        this.openSnackBar('User not found, please register');
        return;
      }

      // Realiza el inicio de sesión
      await this.authService.logInWithEmailAndPassword(credential);

      // Mostrar mensaje de éxito y redirigir a la página principal
      const snackBarRef = this.openSnackBar('Successfully logged in');
      snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigateByUrl('/');
      });
    } catch (error) {
      console.error(error);
      // Manejo de errores según el tipo
      if (error instanceof Error) {
        if (error.message === 'wrong-password') {
          this.openSnackBar('Incorrect password, please try again');
        } else {
          this.openSnackBar('An error occurred, please try again');
        }
      } else {
        this.openSnackBar('An error occurred, please try again');
      }
    }
  }

  /**
   * Método para verificar si un usuario existe en Firestore
   * @param email - Correo del usuario
   * @returns - Verdadero si el usuario existe, falso en caso contrario
   */
  async doesUserExist(email: string): Promise<boolean> {
    try {
      const userDocs = await this.mensajeService.getTasks1();
      return userDocs.docs.some(doc => doc.data()['email'] === email);
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  /**
   * Método para mostrar notificaciones
   * @param message - Mensaje a mostrar
   * @returns Referencia al SnackBar
   */
  openSnackBar(message: string): any {
    return this._snackBar.open(message, 'Close', {
      duration: 2500, // Duración de la notificación en milisegundos
      verticalPosition: 'top', // Posición vertical
      horizontalPosition: 'end', // Posición horizontal
    });
  }
}
