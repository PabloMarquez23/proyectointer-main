
// Importa los módulos y funciones necesarios de Angular y RxJS
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

// Importa el servicio AuthService y los operadores de RxJS necesarios
import { AuthService } from '../services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from 'firebase/auth';
// Define un guardia de ruta llamado AdminGuard y lo marca como Injectable
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  // Constructor del guardia de ruta AdminGuard
  constructor(private authService: AuthService, private router: Router) {}

  // Método canActivate que implementa la interfaz CanActivate
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.authState$.pipe(
      take(1),
      switchMap((user: User | null) => { // Declara el tipo aquí
        if (user) {
          return this.authService.getUserRole(user.uid).pipe(
            map(role => {
              if (role === 'admin') {
                return true;
              } else {
                return this.router.createUrlTree(['/unauthorized']);
              }
            })
          );
        } else {
          return of(this.router.createUrlTree(['/login']));
        }
      })
    );
  }
  
}
