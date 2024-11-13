// book.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Definición de la interfaz Book que representa la estructura de un libro
export interface Book {
  title: string; // Título del libro
  author: string; // Autor(es) del libro
  genre: string; // Género(s) del libro
  description: string; // Descripción del libro
  cover_i: number; // Identificador de la portada del libro
  shortDescription?: string; // Descripción corta opcional del libro
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  constructor(private http: HttpClient) {}

  obtenerLibros(title: string) {
    return this.http.get(`https://www.googleapis.com/books/v1/volumes?q=s${title}`)
  }
  

}
