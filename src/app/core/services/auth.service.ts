// Importa los módulos y funciones necesarios de Angular y Firebase
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Define una interfaz para las credenciales de usuario
export interface Credential {
  email: string;
  password: string;
}

// Define una interfaz para los datos de usuario, incluyendo el rol
export interface UserData {
  role: 'admin' | 'visitor'; // Definición de los roles posibles
  // Otras propiedades si las hubiera
  displayName?: string;
  email?: string;
  // Otras propiedades si las hubiera
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inyecta los servicios de autenticación y Firestore
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Observable para seguir el estado de autenticación del usuario
  readonly authState$ = authState(this.auth);

  // Método para registrar un usuario con correo electrónico y contraseña
  async signUpWithEmailAndPassword(credential: Credential, role: 'visitor' | 'admin', additionalData: any): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, credential.email, credential.password);
    await this.setUserRole(userCredential.user.uid, role, additionalData);
    return userCredential;
  }

  // Método para iniciar sesión con correo electrónico y contraseña
  async logInWithEmailAndPassword(credential: Credential): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, credential.email, credential.password);
      const userId = userCredential.user.uid;
      const userDoc = await getDoc(doc(this.firestore, `users/${userId}`));
      if (userDoc.exists()) {
        const userData: UserData = userDoc.data() as UserData;
        const userRole = userData.role; // Acceso a la propiedad 'role'
        if (userRole === 'admin') {
          // Usuario es administrador
          // Realiza acciones específicas para administradores
        } else if (userRole === 'visitor') {
          // Usuario es visitante
          // Realiza acciones específicas para visitantes
        }
      } else {
        console.error('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  // Método para cerrar sesión
  logOut(): Promise<void> {
    return this.auth.signOut();
  }

  // Método para iniciar sesión con proveedor de Google
  signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return this.callPopUp(provider);
  }

  // Método para iniciar sesión con proveedor de GitHub
  signInWithGithubProvider(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();
    return this.callPopUp(provider);
  }

  // Método para realizar la autenticación mediante popup
  async callPopUp(provider: AuthProvider): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error: any) {
      return error;
    }
  }

  // Método privado para establecer el rol de un usuario en Firestore
  private async setUserRole(userId: string, role: 'visitor' | 'admin', additionalData: any): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { role: role.toString(), ...additionalData });
  }

  // Método para obtener el rol de un usuario
  getUserRole(userId: string): Observable<string | null> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as UserData;
          return userData.role;
        } else {
          return null;
        }
      })
    );
  }

  // Método para actualizar los datos de un usuario en Firestore
  async updateUserData(userId: string, userData: UserData): Promise<void> {
    try {
      const userDoc = doc(this.firestore, `users/${userId}`);
      await setDoc(userDoc, userData, { merge: true });
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      throw error;
    }
  }
}


  
