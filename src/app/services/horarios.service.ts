import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Horarios } from '../domain/horarios';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private collectionName = 'horarios';
  horariosCollection: any;

  constructor(private firestore: Firestore) {}

  getHorarios() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  addHorario(horario: Horarios) {
    return addDoc(collection(this.firestore, this.collectionName), { ...horario });
  }

  updateHorario(id: string, horario: Partial<Horarios>) {
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...horario });
  }

  deleteHorario(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}
