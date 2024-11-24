import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';  // Importa las funciones necesarias de Firebase Firestore para interactuar con la base de datos.
import { GestionEspacios } from '../domain/gestionespacios';  // Importa el tipo de dato GestionEspacios, que representa los datos de cada espacio gestionado.
import { map, Observable } from 'rxjs';  // Importa funciones de RxJS para manejar flujos de datos reactivos.

@Injectable({
  providedIn: 'root'  // Declara que este servicio estará disponible globalmente en la aplicación.
})
export class GestionEspaciosService {
  
  private collectionName = 'espacios';

  constructor(private firestore: Firestore) {}

  // Obtener los espacios
  getEspacios() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  // Añadir un nuevo espacio
  addEspacio(espacio: GestionEspacios) {
    return addDoc(collection(this.firestore, this.collectionName), { ...espacio });
  }

  deleteEspacio(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
  
  // Obtiene la referencia de la colección
  getEspaciosCollection(): Observable<GestionEspacios[]> {
    return collectionData(collection(this.firestore, this.collectionName), { idField: 'id' }) as Observable<GestionEspacios[]>;
  }
}
