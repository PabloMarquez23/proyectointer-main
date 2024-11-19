import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service'; // Servicio para gestionar los contratos
import { Contratos } from '../../domain/contratos'; // Interfaz que define la estructura de los contratos
import HomeComponent from '../home/home.component'; // Componente de inicio
import { FormsModule } from '@angular/forms'; // Módulo de formularios para manejo de ngModel
import { CommonModule } from '@angular/common'; // Módulo Angular para funcionalidades comunes
import { RouterLink } from '@angular/router'; // Módulo para navegación entre rutas

@Component({
  selector: 'app-contratos', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink], // Módulos y componentes importados
  templateUrl: './contratos.component.html', // Ruta del archivo de plantilla
  styleUrls: ['./contratos.component.scss'] // Ruta del archivo de estilos
})
export class ContratosComponent implements OnInit {
  // Lista de contratos que se mostrará en la vista
  contratos: Contratos[] = [];

  // Modelo para el formulario de nuevo contrato
  nuevoContrato: Contratos = {
    cliente: '',
    placa: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    numeroespacio: '',
    montoMensual: 0,
    estado: 'Disponible' // Estado inicial del contrato
  };

  // Inyección del servicio ContratosService para interactuar con la base de datos
  constructor(private contratosService: ContratosService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerContratos(); // Llama a la función para cargar los contratos existentes
  }

  /**
   * Obtiene la lista de contratos desde el servicio ContratosService.
   * Realiza una consulta a la base de datos y asigna los resultados al arreglo `contratos`.
   */
  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      // Mapea los documentos obtenidos a objetos del tipo Contratos
      this.contratos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log({ id: doc.id, ...data }); // Imprime los datos del contrato en consola
        return { id: doc.id, ...data } as Contratos; // Crea un objeto Contratos incluyendo el ID
      });
    });
  }

  /**
   * Agrega un nuevo contrato a la base de datos.
   * Valida que los campos obligatorios estén llenos antes de proceder.
   */
  agregarContrato() {
    // Validación de campos requeridos
    if (this.nuevoContrato.cliente && this.nuevoContrato.numeroespacio && this.nuevoContrato.montoMensual >= 0) {
      this.contratosService.addContrato(this.nuevoContrato).then(() => {
        // Resetea el formulario al estado inicial
        this.nuevoContrato = {
          cliente: '',
          placa: '',
          fechaInicio: new Date(),
          fechaFin: new Date(),
          numeroespacio: '',
          montoMensual: 0,
          estado: 'Disponible'
        };
        this.obtenerContratos(); // Actualiza la lista de contratos
      }).catch(error => {
        console.error('Error al agregar contrato:', error); // Manejo de errores
      });
    } else {
      console.warn('Por favor, completa todos los campos obligatorios.'); // Mensaje de advertencia
    }
  }

  /**
   * Elimina un contrato de la base de datos.
   * @param id El ID del contrato a eliminar.
   */
  eliminarContrato(id: string | undefined) {
    if (id) {
      this.contratosService.deleteContrato(id).then(() => {
        this.obtenerContratos(); // Actualiza la lista tras eliminar
      });
    } else {
      console.error('Error: El ID del contrato es undefined.'); // Manejo de errores si el ID no está definido
    }
  }

  /**
   * Función de seguimiento para optimizar el rendimiento de la lista.
   * Permite a Angular identificar correctamente los elementos por su ID.
   * @param index Índice del elemento en la lista.
   * @param contrato Objeto del contrato.
   * @returns ID del contrato o el índice como cadena.
   */
  trackById(index: number, contrato: Contratos): string {
    return contrato.id ? contrato.id : index.toString(); // Devuelve el ID del contrato o el índice como respaldo
  }
}
