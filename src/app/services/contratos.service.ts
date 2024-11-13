import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Contratos } from '../domain/contratos';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private collectionName = 'contratos';

  constructor(private firestore: Firestore) {}

  getContratos() {
    return getDocs(query(collection(this.firestore, this.collectionName)));
  }

  addContrato(contrato: Contratos) {
    return addDoc(collection(this.firestore, this.collectionName), { ...contrato });
  }

  updateContrato(id: string, contrato: Partial<Contratos>) {
    return updateDoc(doc(this.firestore, this.collectionName, id), { ...contrato });
  }

  deleteContrato(id: string) {
    return deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}
