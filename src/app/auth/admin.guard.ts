import { CanActivateFn, Router, UrlTree } from '@angular/router'; // Importa las dependencias necesarias para el guardia de ruta
import { inject } from '@angular/core'; // Importa la función inject para obtener las instancias de los servicios
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa el módulo AngularFireAuth para la autenticación con Firebase
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa el módulo AngularFirestore para interactuar con Firestore
import { map, switchMap } from 'rxjs/operators'; // Importa operadores de RxJS para manejar flujos de datos asincrónicos
import { of, Observable } from 'rxjs'; // Importa el objeto Observable y la función of de RxJS

// Define una interfaz para representar la estructura de los usuarios
interface User {
  uid: string;
  nombre: string;
  email: string;
  role: string;
}

// Define un guardia de ruta llamado adminGuard
export const adminGuard: CanActivateFn = (route, state) => {
  // Obtiene instancias de AngularFireAuth, AngularFirestore y Router utilizando la función inject
  const afAuth = inject(AngularFireAuth);
  const afs = inject(AngularFirestore);
  const router = inject(Router);

  // Utiliza el flujo de autenticación de AngularFireAuth para obtener el estado de autenticación actual
  return afAuth.authState.pipe(
    // Utiliza switchMap para manejar el flujo de observables
    switchMap(user => {
      // Si no hay un usuario autenticado, redirige al usuario a la página de inicio de sesión y devuelve un observable de false
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }
      // Si hay un usuario autenticado, obtiene el documento de usuario correspondiente a partir de su UID utilizando AngularFirestore
      return afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(
        // Utiliza el operador map para verificar si el usuario tiene el rol de administrador
        map(userDoc => {
          // Si no hay un documento de usuario o el usuario no tiene el rol de administrador, redirige al usuario a la página principal y devuelve un observable de false
          if (!userDoc || userDoc.role !== 'admin') {
            router.navigate(['/']);
            return false;
          }
          // Si el usuario es administrador, devuelve un observable de true, permitiendo el acceso a la ruta protegida
          return true;
        })
      );
    })
  ) as Observable<boolean | UrlTree>; // Realiza un casting del resultado como un observable de tipo boolean | UrlTree
};


