import { Injectable } from '@angular/core';  // Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes o servicios.

@Injectable({
  providedIn: 'root'  // Declara que este servicio está disponible globalmente en la aplicación.
})
export class ErroresService {

  // Constructor vacío, ya que este servicio no depende de ningún otro servicio o funcionalidad adicional.
  constructor() { }

  /**
   * Método para obtener un mensaje de error o éxito según el código proporcionado.
   * Este método es útil para manejar mensajes de error o éxito en la aplicación según los códigos predefinidos.
   * @param code Código de error o éxito que se recibe como argumento.
   * @returns Devuelve un mensaje adecuado según el código proporcionado.
   */
  codeError(code: string) {
    switch(code) {
      // Caso para el código 'success/document-saved', que indica que un documento se guardó correctamente.
      case 'success/document-saved':
        return 'El documento se guardó correctamente';

      // Caso por defecto para cualquier código no reconocido, devuelve un mensaje genérico.
      default:
        return 'Error desconocido';
    }
  }
}
