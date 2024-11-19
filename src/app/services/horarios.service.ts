import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';  // Importa las funciones necesarias de Firebase Firestore para interactuar con la base de datos.
import { Horarios } from '../domain/horarios';  // Importa el tipo `Horarios`, que representa los datos de cada horario gestionado.

@Injectable({
  providedIn: 'root'  // Declara que este servicio estará disponible globalmente en la aplicación.
})
export class HorariosService {
  // Define el nombre de la colección en Firestore que contiene los horarios.
  private collectionName = 'horarios';
  horariosCollection: any;  // Define un atributo para almacenar la referencia a la colección (aunque no es usado explícitamente en este servicio).

  // Constructor que inyecta Firestore para poder interactuar con la base de datos de Firestore.
  constructor(private firestore: Firestore) {}

  /**
   * Método para obtener todos los horarios desde la base de datos.
   * Este método consulta la colección 'horarios' en Firestore y devuelve todos los documentos que contiene.
   * @returns Un `QuerySnapshot` con los documentos de la colección `horarios`.
   */
  getHorarios() {
    // Realiza una consulta sobre la colección 'horarios' y obtiene todos los documentos.
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  /**
   * Método para agregar un nuevo horario a la base de datos.
   * Este método toma un objeto `horario` y lo agrega a la colección 'horarios' en Firestore.
   * @param horario El objeto `Horarios` que representa el nuevo horario que se desea agregar.
   * @returns Un `Promise` con el resultado de la operación de agregar el documento.
   */
  addHorario(horario: Horarios) {
    // Agrega el objeto `horario` a la colección 'horarios' en Firestore.
    return addDoc(collection(this.firestore, this.collectionName), { ...horario });
  }

  /**
   * Método para actualizar un horario existente en la base de datos.
   * Este método actualiza un horario específico utilizando el `id` y los nuevos datos proporcionados en el objeto `horario`.
   * @param id El ID del horario que se desea actualizar.
   * @param horario Un objeto `Partial<Horarios>` que contiene los campos que se deben actualizar.
   * @returns Un `Promise` con el resultado de la operación de actualización del documento.
   */
  updateHorario(id: string, horario: Partial<Horarios>) {
    // Obtiene una referencia al documento con el `id` proporcionado y actualiza los campos con los datos del objeto `horario`.
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...horario });
  }

  /**
   * Método para eliminar un horario de la base de datos.
   * Este método elimina un horario específico utilizando el `id` del documento en la colección 'horarios'.
   * @param id El ID del horario que se desea eliminar.
   * @returns Un `Promise` con el resultado de la operación de eliminación del documento.
   */
  deleteHorario(id: string) {
    // Obtiene una referencia al documento con el `id` proporcionado y lo elimina de la colección 'horarios'.
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}
