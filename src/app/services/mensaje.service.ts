import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, getDoc} from '@angular/fire/firestore';
import { Tasks } from '../domain/Tasks';
import { users } from '../domain/users';



import { getAuth } from 'firebase/auth';





@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private firestore: Firestore){}
  addTask1(us: users) {
    // Devuelve la Promise para permitir el uso de .then() y .catch()
    return addDoc(collection(this.firestore, 'users'), Object.assign({}, us));
  }
  
  updateTask1(userId: string, us: users) {
    const userDocRef = doc(this.firestore, 'users', userId);
    return updateDoc(userDocRef, { ...us });
  }
  addTask(task: Tasks){
    addDoc(collection(this.firestore, 'tareas'),Object.assign({},task))
  }
  
  gettask() {
    return getDocs(query(collection(this.firestore, 'tareas')));
  }
  deleteTasks(taskId: string) {
    return deleteDoc(doc(this.firestore, 'tareas', taskId))
  }
 

  
  getTasks1(){
    return getDocs(query(collection(this.firestore, 'users')))
  }
  deleteTasks1(usid: string) {
    return deleteDoc(doc(this.firestore, 'users', usid))
  }

  getCurrentUser() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(this.firestore, 'users', currentUser.uid);
      return getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          throw new Error('No se encontró el usuario');
        }
      });
    } else {
      return Promise.reject('No hay usuario autenticado');
    }
  }

 // MensajeService







}
