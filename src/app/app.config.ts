import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient , withFetch } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule





export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyDyuhKPvjkJq4Eddvc48-_UzEkLQ0ghw0U",
  authDomain: "pruebainter-e8d27.firebaseapp.com",
  projectId: "pruebainter-e8d27",
  storageBucket: "pruebainter-e8d27.firebasestorage.app",
  messagingSenderId: "161651471990",
  appId: "1:161651471990:web:a6a905a543c1cbcee49157"
    })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"pruebainter-e8d27",
      "appId":"1:161651471990:web:a6a905a543c1cbcee49157","storageBucket":"pruebainter-e8d27.firebasestorage.app",
      "apiKey":"AIzaSyDyuhKPvjkJq4Eddvc48-_UzEkLQ0ghw0U","authDomain":"pruebainter-e8d27.firebaseapp.com",
      "messagingSenderId":"161651471990"})), provideFirestore(() => getFirestore()),
    provideHttpClient(withFetch()), provideFirebaseApp(() => initializeApp({"projectId":"pruebainter-e8d27",
      "appId":"1:161651471990:web:a6a905a543c1cbcee49157","storageBucket":"pruebainter-e8d27.firebasestorage.app",
      "apiKey":"AIzaSyDyuhKPvjkJq4Eddvc48-_UzEkLQ0ghw0U","authDomain":"pruebainter-e8d27.firebaseapp.com",
      "messagingSenderId":"161651471990"})), provideAuth(() => getAuth()), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"pruebainter-e8d27","appId":"1:161651471990:web:a6a905a543c1cbcee49157","storageBucket":"pruebainter-e8d27.firebasestorage.app","apiKey":"AIzaSyDyuhKPvjkJq4Eddvc48-_UzEkLQ0ghw0U","authDomain":"pruebainter-e8d27.firebaseapp.com","messagingSenderId":"161651471990"})), provideAuth(() => getAuth())
    ]
};

