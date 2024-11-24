import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';  // Importa funciones de Firebase Firestore para interactuar con la base de datos Firestore.
import { Contratos } from '../domain/contratos';  // Importa la clase Contratos que define la estructura de los contratos.
import { Observable } from 'rxjs';  // Importa Observable de RxJS, que permite trabajar con flujos de datos reactivos.

@Injectable({
  providedIn: 'root'  // Declara que este servicio está disponible a nivel global en la aplicación.
})
export class ContratosService {
  // Nombre de la colección en Firestore donde se almacenan los contratos.
  private collectionName = 'contratos';

  // Constructor que inyecta el servicio Firestore en el servicio ContratosService
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todos los contratos de la base de datos.
   * @returns Devuelve una promesa con los documentos de la colección 'contratos' en Firestore.
   */
  getContratos() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  /**
   * Agrega un nuevo contrato a la base de datos.
   * @param contrato Objeto de tipo Contratos que se desea agregar.
   * @returns Devuelve una promesa con el documento agregado a la colección 'contratos'.
   */
  addContrato(contrato: Contratos) {
    // Se agrega un nuevo documento a la colección 'contratos'.
    return addDoc(collection(this.firestore, this.collectionName), { ...contrato });
  }

  /**
   * Actualiza un contrato existente en la base de datos.
   * @param id Identificador del contrato que se desea actualizar.
   * @param contrato Objeto parcial de tipo Contratos que contiene los campos a actualizar.
   * @returns Devuelve una promesa con la operación de actualización realizada.
   */
  updateContrato(id: string, contrato: Partial<Contratos>) {
    // Se obtiene el documento específico con el ID proporcionado y se actualiza con los datos del objeto contrato.
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...contrato });
  }

  /**
   * Elimina un contrato de la base de datos.
   * @param id Identificador del contrato que se desea eliminar.
   * @returns Devuelve una promesa con la operación de eliminación realizada.
   */
  deleteContrato(id: string) {
    // Se obtiene el documento específico con el ID proporcionado y se elimina de la colección 'contratos'.
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }

  //conectado a la gestion espacios
  obtenerContratos(): Observable<any[]> {
    const contratosCollection = collection(this.firestore, this.collectionName);
    return collectionData(contratosCollection) as Observable<any[]>;
  }

  
}