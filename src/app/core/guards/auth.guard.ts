// Importa los módulos y funciones necesarios de Angular y RxJS
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

// Define una función para inyectar el Router
export const routerInjection = () => inject(Router);

// Define una función para obtener el observable authState$ del AuthService
export const authStateObs$ = () => inject(AuthService).authState$;

// Define un guardia de ruta llamado authGuard
export const authGuard: CanActivateFn = () => {
  // Obtiene una instancia del Router
  const router = routerInjection();

  // Utiliza el observable authState$ del AuthService para verificar el estado de autenticación del usuario
  return authStateObs$().pipe(
    // Utiliza el operador map para transformar el valor del observable
    map((user) => {
      // Verifica si el usuario no está autenticado
      if (!user) {
        // Redirige al usuario a la página de inicio de sesión y devuelve false
        router.navigateByUrl('auth/log-in');
        return false;
      }
      // Devuelve true si el usuario está autenticado
      return true;
    })
  );
};

// Define un guardia de ruta llamado publicGuard
export const publicGuard: CanActivateFn = () => {
  // Obtiene una instancia del Router
  const router = routerInjection();

  // Utiliza el observable authState$ del AuthService para verificar el estado de autenticación del usuario
  return authStateObs$().pipe(
    // Utiliza el operador map para transformar el valor del observable
    map((user) => {
      // Verifica si el usuario está autenticado
      if (user) {
        // Redirige al usuario a la página de inicio si está autenticado y devuelve false
        router.navigateByUrl('/');
        return false;
      }
      // Devuelve true si el usuario no está autenticado
      return true;
    })
  );
};
