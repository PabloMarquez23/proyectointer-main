import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';  // Importa las funciones necesarias de Firebase Firestore para interactuar con la base de datos.
import { Tarifas } from '../domain/tarifas';  // Importa el tipo `Tarifas`, que representa las tarifas en la base de datos.

@Injectable({
  providedIn: 'root'  // Declara que este servicio estará disponible globalmente en la aplicación.
})
export class TarifasService {
  private collectionName = 'tarifas';  // Define el nombre de la colección en Firestore donde se almacenan las tarifas.
  tarifasCollection: any;  // Define la variable para la colección de tarifas.

  constructor(private firestore: Firestore) {}

  /**
   * Método para obtener todas las tarifas almacenadas en la base de datos.
   * Este método consulta la colección 'tarifas' en Firestore y devuelve todos los documentos que contiene.
   * @returns Un `QuerySnapshot` con todos los documentos de la colección 'tarifas'.
   */
  getTarifas() {
    return getDocs(query(collection(this.firestore, this.collectionName)));  // Obtiene todos los documentos de la colección 'tarifas'.
  }

  /**
   * Método para agregar una nueva tarifa a la base de datos.
   * Este método toma un objeto `Tarifas` y lo agrega a la colección 'tarifas' en Firestore.
   * @param tarifa El objeto `Tarifas` que representa la tarifa que se desea agregar.
   * @returns Un `Promise` que resuelve la operación de agregar la tarifa a Firestore.
   */
  addTarifa(tarifa: Tarifas) {
    return addDoc(collection(this.firestore, this.collectionName), { ...tarifa });  // Agrega la tarifa a la colección 'tarifas'.
  }

  /**
   * Método para actualizar una tarifa existente en la base de datos.
   * Este método actualiza un documento específico en la colección 'tarifas' utilizando el `id` de la tarifa.
   * @param id El ID de la tarifa que se desea actualizar.
   * @param tarifa El objeto `Tarifas` con los nuevos datos que se desean actualizar.
   * @returns Un `Promise` que resuelve la operación de actualización de la tarifa.
   */
  updateTarifa(id: string, tarifa: Partial<Tarifas>) {
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...tarifa });  // Actualiza el documento con los nuevos datos de la tarifa.
  }

  /**
   * Método para eliminar una tarifa de la base de datos.
   * Este método elimina un documento específico de la colección 'tarifas' utilizando el `id` de la tarifa.
   * @param id El ID de la tarifa que se desea eliminar.
   * @returns Un `Promise` que resuelve la operación de eliminación de la tarifa.
   */
  deleteTarifa(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));  // Elimina el documento con el ID proporcionado de la colección 'tarifas'.
  }
}
