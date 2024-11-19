import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';  // Importa las funciones necesarias de Firebase Firestore para interactuar con la base de datos.
import { GestionEspacios } from '../domain/gestionespacios';  // Importa el tipo de dato GestionEspacios, que representa los datos de cada espacio gestionado.
import { map, Observable } from 'rxjs';  // Importa funciones de RxJS para manejar flujos de datos reactivos.

@Injectable({
  providedIn: 'root'  // Declara que este servicio estará disponible globalmente en la aplicación.
})
export class GestionEspaciosService {
  
  // Constructor que inyecta Firestore para poder interactuar con la base de datos de Firestore.
  constructor(private firestore: Firestore) {}

  /**
   * Método asíncrono para obtener todos los espacios desde la base de datos.
   * Este método consulta la colección 'espacios' en Firestore y devuelve los datos de los espacios.
   * @returns Un array de objetos `GestionEspacios` con los datos de los espacios.
   */
  async getEspacios() {
    // Se obtiene una referencia a la colección 'espacios' en Firestore.
    const espaciosRef = collection(this.firestore, 'espacios');
    
    // Se realiza una consulta para obtener todos los documentos de la colección 'espacios'.
    const snapshot = await getDocs(espaciosRef);
    
    // Se mapean los resultados de la consulta a un array de objetos `GestionEspacios`, añadiendo el `id` de cada documento.
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as GestionEspacios[];
  }

  /**
   * Método asíncrono para actualizar el estado de un espacio en la base de datos.
   * Este método actualiza un espacio específico en Firestore con un nuevo estado (usando `Partial<GestionEspacios>`).
   * @param id El ID del espacio a actualizar.
   * @param nuevoEstado Un objeto con los campos que se desean actualizar.
   */
  async actualizarEstadoEspacio(id: string, nuevoEstado: Partial<GestionEspacios>) {
    // Se obtiene una referencia al documento del espacio específico usando el ID.
    const espacioDocRef = doc(this.firestore, `espacios/${id}`);
    
    // Se actualiza el documento con el nuevo estado proporcionado.
    await updateDoc(espacioDocRef, nuevoEstado);
  }
}
