import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Tarifas } from '../domain/tarifas';

@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  private collectionName = 'tarifas';
  tarifasCollection: any;

  constructor(private firestore: Firestore) {}

  getTarifas() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  addTarifa(tarifa: Tarifas) {
    return addDoc(collection(this.firestore, this.collectionName), { ...tarifa });
  }

  updateTarifa(id: string, tarifa: Partial<Tarifas>) {
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...tarifa });
  }

  deleteTarifa(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}