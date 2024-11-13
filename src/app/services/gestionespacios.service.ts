import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { GestionEspacios } from '../domain/gestionespacios';

@Injectable({
  providedIn: 'root'
})
export class GestionEspaciosService {
  private collectionName = 'gestiones_espacios';

  constructor(private firestore: Firestore) {}

  getEspacios() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  addEspacio(espacio: GestionEspacios) {
    return addDoc(collection(this.firestore, this.collectionName), { ...espacio });
  }

  updateEspacio(id: string, espacio: Partial<GestionEspacios>) {
    const espacioDocRef = doc(this.firestore, this.collectionName, id);
    return updateDoc(espacioDocRef, { ...espacio });
  }

  deleteEspacio(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}