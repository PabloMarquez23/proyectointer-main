import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

export type Provider = 'github' | 'google';

@Component({
  selector: 'app-button-providers',
  standalone: true, // ¿Qué significa esta propiedad?
  imports: [], // ¿Por qué se importa aquí?
  templateUrl: './button-providers.component.html',
  styleUrl: './button-providers.component.scss'
})
export class ButtonProvidersComponent {

  @Input() isLogin = false;

  // Inyección de dependencias para AuthService y Router
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // Método para realizar la acción del proveedor de autenticación
  providerAction(provider: Provider): void {
    if (provider === 'google') {
      this.signUpWithGoogle();
    } 
  }

  // Método para iniciar sesión con Google
  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this._authService.signInWithGoogleProvider();
      this._router.navigateByUrl('/');
      console.log(result); // ¿Qué se hace con el resultado?
    } catch (error) {
      console.log(error); // Manejo de errores
    }
  }

  

}