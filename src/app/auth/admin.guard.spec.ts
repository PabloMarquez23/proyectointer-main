// Importaciones necesarias para las pruebas unitarias
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

// Importación del guardia de ruta que se va a probar
import { adminGuard } from './admin.guard';

// Bloque que describe las pruebas unitarias del guardia adminGuard
describe('adminGuard', () => {
  // Definición de una función que ejecuta el guardia de ruta con los parámetros necesarios
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  // Prueba para verificar si el guardia adminGuard se crea correctamente
  it('should be created', () => {
    // Verifica si la función executeGuard está definida y no es nula
    expect(executeGuard).toBeTruthy();
  });
});
