// src/app/services/generic-crud.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WithId {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CrudService<T extends WithId> {
  constructor(private readonly firestore: Firestore) {}

  /** Obtiene el referencia a la colección */
  private colRef(path: string): CollectionReference<T> {
    return collection(this.firestore, path) as CollectionReference<T>;
  }

  /** Obtiene el documento */
  private docRef(path: string, id: string): DocumentReference<DocumentData> {
    return doc(this.firestore, `${path}/${id}`);
  }

  /** Crea un documento nuevo y devuelve su id */
  create(path: string, data: Omit<T, 'id'>): Promise<string> {
    return addDoc(this.colRef(path), data).then(ref => ref.id);
  }

  /** Lee todos los documentos de la colección */
  getAll(path: string): Observable<T[]> {
    return collectionData(this.colRef(path), { idField: 'id' }) as Observable<T[]>;
  }

  /** Lee un documento por ID */
  getById(path: string, id: string): Observable<T | undefined> {
    return docData(this.docRef(path, id), { idField: 'id' }) as Observable<T>;
  }

  /** Actualiza un documento existente */
  update(path: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    return updateDoc(this.docRef(path, id), data);
  }

  /** Elimina un documento */
  delete(path: string, id: string): Promise<void> {
    return deleteDoc(this.docRef(path, id));
  }

  /** Opcional: genera un Observable con docs + cambios personalizados */
  watch(path: string): Observable<{ id: number; data: T }[]> {
    return collectionData(this.colRef(path), { idField: 'id' }).pipe(
      map(arr => arr.map(item => ({ id: item.id!, data: item })))
    );
  }
}
