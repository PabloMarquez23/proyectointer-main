import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor() { }
  codeError(code:string){
    switch(code){
      //usuario existe
      // Documento guardado correctamente
      case 'success/document-saved':
        return 'El documento se guardó correctamente';

      default:
        return 'Error desconocido';
    }
  }
}
