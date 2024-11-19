import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Tipo personalizado que define los proveedores de autenticación permitidos
export type Provider = 'github' | 'google';

@Component({
  // Selector que identifica este componente en una plantilla HTML
  selector: 'app-button-providers',
  // Configuración que indica que este componente es autónomo
  standalone: true, // Permite usar el componente sin depender de un módulo (ideal para módulos independientes o microfrontends)
  // Lista de módulos o componentes que se importan en este componente
  imports: [], // Aquí se podrían agregar otros componentes o directivas necesarias para el funcionamiento
  // Ruta del archivo de la plantilla HTML
  templateUrl: './button-providers.component.html',
  // Ruta del archivo de estilos del componente
  styleUrl: './button-providers.component.scss'
})
export class ButtonProvidersComponent {
  // Decorador @Input() para recibir datos desde el componente padre
  @Input() isLogin = false; // Determina si el botón debe mostrar opciones de inicio de sesión o registro

  // Inyección de dependencias mediante `inject()`:
  private _authService = inject(AuthService); // Servicio para manejar la autenticación
  private _router = inject(Router); // Servicio para manejar la navegación entre rutas

  /**
   * Método que realiza acciones según el proveedor de autenticación seleccionado.
   * @param provider - El proveedor de autenticación seleccionado ('google' o 'github').
   */
  providerAction(provider: Provider): void {
    if (provider === 'google') {
      // Si el proveedor es Google, llama al método para iniciar sesión con Google
      this.signUpWithGoogle();
    }
  }

  /**
   * Método asíncrono para manejar la autenticación con Google.
   * Realiza el inicio de sesión y redirige al usuario al inicio en caso de éxito.
   */
  async signUpWithGoogle(): Promise<void> {
    try {
      // Llama al método del servicio de autenticación para iniciar sesión con Google
      const result = await this._authService.signInWithGoogleProvider();
      // Redirige al usuario a la página de inicio tras la autenticación exitosa
      this._router.navigateByUrl('/');
      // Imprime el resultado de la autenticación en la consola (generalmente contiene información del usuario autenticado)
      console.log(result);
    } catch (error) {
      // Si ocurre un error durante la autenticación, se captura y muestra en la consola
      console.log(error);
    }
  }
}
