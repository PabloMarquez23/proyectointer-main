import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { GestionEspacios } from '../domain/gestionespacios';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Contratos } from '../domain/contratos';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionEspaciosService {
  constructor(private firestore: Firestore) {}

  async getEspacios() {
    const espaciosRef = collection(this.firestore, 'espacios');
    const snapshot = await getDocs(espaciosRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as GestionEspacios[];
  }

  async actualizarEstadoEspacio(id: string, nuevoEstado: Partial<GestionEspacios>) {
    const espacioDocRef = doc(this.firestore, `espacios/${id}`);
    await updateDoc(espacioDocRef, nuevoEstado);
  }
}