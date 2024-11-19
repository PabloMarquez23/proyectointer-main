import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, getDoc } from '@angular/fire/firestore';  // Importa las funciones necesarias de Firebase Firestore para interactuar con la base de datos.
import { Tasks } from '../domain/Tasks';  // Importa el tipo `Tasks`, que representa las tareas en la base de datos.
import { users } from '../domain/users';  // Importa el tipo `users`, que representa los usuarios en la base de datos.
import { getAuth } from 'firebase/auth';  // Importa la función `getAuth` para acceder a la autenticación de Firebase.

@Injectable({
  providedIn: 'root'  // Declara que este servicio estará disponible globalmente en la aplicación.
})
export class MensajeService {

  // Constructor que inyecta Firestore para poder interactuar con la base de datos de Firestore.
  constructor(private firestore: Firestore) {}

  /**
   * Método para agregar un nuevo usuario a la base de datos.
   * Este método toma un objeto `users` y lo agrega a la colección 'users' en Firestore.
   * @param us El objeto `users` que representa el usuario que se desea agregar.
   * @returns Un `Promise` que resuelve la operación de agregar el usuario a Firestore.
   */
  addTask1(us: users) {
    return addDoc(collection(this.firestore, 'users'), Object.assign({}, us));  // Agrega el usuario a la colección 'users'.
  }

  /**
   * Método para actualizar un usuario existente en la base de datos.
   * Este método actualiza un documento específico en la colección 'users' utilizando el `userId`.
   * @param userId El ID del usuario que se desea actualizar.
   * @param us El objeto `users` con los nuevos datos que se desean actualizar.
   * @returns Un `Promise` que resuelve la operación de actualización del usuario.
   */
  updateTask1(userId: string, us: users) {
    const userDocRef = doc(this.firestore, 'users', userId);  // Obtiene una referencia al documento del usuario con el ID proporcionado.
    return updateDoc(userDocRef, { ...us });  // Actualiza el documento con los nuevos datos del usuario.
  }

  /**
   * Método para agregar una nueva tarea a la base de datos.
   * Este método toma un objeto `Tasks` y lo agrega a la colección 'tareas' en Firestore.
   * @param task El objeto `Tasks` que representa la tarea que se desea agregar.
   */
  addTask(task: Tasks) {
    addDoc(collection(this.firestore, 'tareas'), Object.assign({}, task));  // Agrega la tarea a la colección 'tareas'.
  }

  /**
   * Método para obtener todas las tareas de la base de datos.
   * Este método consulta la colección 'tareas' en Firestore y devuelve todos los documentos que contiene.
   * @returns Un `QuerySnapshot` con los documentos de la colección `tareas`.
   */
  gettask() {
    return getDocs(query(collection(this.firestore, 'tareas')));  // Obtiene todos los documentos de la colección 'tareas'.
  }

  /**
   * Método para eliminar una tarea de la base de datos.
   * Este método elimina un documento específico de la colección 'tareas' utilizando el `taskId`.
   * @param taskId El ID de la tarea que se desea eliminar.
   * @returns Un `Promise` que resuelve la operación de eliminación de la tarea.
   */
  deleteTasks(taskId: string) {
    return deleteDoc(doc(this.firestore, 'tareas', taskId));  // Elimina el documento con el ID proporcionado de la colección 'tareas'.
  }

  /**
   * Método para obtener todos los usuarios de la base de datos.
   * Este método consulta la colección 'users' en Firestore y devuelve todos los documentos que contiene.
   * @returns Un `QuerySnapshot` con los documentos de la colección `users`.
   */
  getTasks1() {
    return getDocs(query(collection(this.firestore, 'users')));  // Obtiene todos los documentos de la colección 'users'.
  }

  /**
   * Método para eliminar un usuario de la base de datos.
   * Este método elimina un documento específico de la colección 'users' utilizando el `usid`.
   * @param usid El ID del usuario que se desea eliminar.
   * @returns Un `Promise` que resuelve la operación de eliminación del usuario.
   */
  deleteTasks1(usid: string) {
    return deleteDoc(doc(this.firestore, 'users', usid));  // Elimina el documento con el ID proporcionado de la colección 'users'.
  }

  /**
   * Método para obtener el usuario actualmente autenticado.
   * Este método obtiene el usuario autenticado desde Firebase Authentication y luego recupera su documento correspondiente de la colección 'users'.
   * @returns Un `Promise` con los datos del usuario autenticado o un error si no se encuentra.
   */
  getCurrentUser() {
    const auth = getAuth();  // Obtiene la instancia de autenticación de Firebase.
    const currentUser = auth.currentUser;  // Obtiene el usuario actualmente autenticado.

    if (currentUser) {
      const userDocRef = doc(this.firestore, 'users', currentUser.uid);  // Obtiene una referencia al documento del usuario autenticado.
      return getDoc(userDocRef).then(docSnap => {  // Obtiene los datos del usuario desde Firestore.
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };  // Si el documento existe, devuelve los datos del usuario con el ID.
        } else {
          throw new Error('No se encontró el usuario');  // Si no se encuentra el usuario, lanza un error.
        }
      });
    } else {
      return Promise.reject('No hay usuario autenticado');  // Si no hay usuario autenticado, rechaza la promesa con un error.
    }
  }
}
