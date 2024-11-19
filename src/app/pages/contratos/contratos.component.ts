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
    if (!this.nuevoContrato.cliente || !this.nuevoContrato.numeroespacio || !this.nuevoContrato.montoMensual) {
      if (!this.nuevoContrato.cliente) {
        alert('El nombre del cliente es obligatorio.');
      }
      if (!this.nuevoContrato.numeroespacio) {
        alert('El número de espacio es obligatorio.');
      }
      if (!this.nuevoContrato.montoMensual) {
        alert('El monto mensual es obligatorio.');
      }
      return;
    }
  
    // Validación: El nombre del cliente no debe contener números
    const regexNombreCliente = /^[A-Za-z\s]+$/;
    if (!regexNombreCliente.test(this.nuevoContrato.cliente)) {
      alert('El nombre del cliente no debe contener números.');
      return;
    }
  
    // Validación: La fecha de inicio debe ser antes de la fecha de fin
    if (this.nuevoContrato.fechaInicio >= this.nuevoContrato.fechaFin) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }
  
    // Validación: El número de espacio debe ser un número
    if (isNaN(Number(this.nuevoContrato.numeroespacio))) {
      alert('El número de espacio debe ser un número válido.');
      return;
    }
  
    // Validación: El monto mensual debe ser un número positivo
    if (isNaN(this.nuevoContrato.montoMensual) || this.nuevoContrato.montoMensual <= 0) {
      alert('El monto mensual debe ser un número positivo.');
      return;
    }
  
    // Si todas las validaciones son correctas, agrega el contrato
    this.contratosService.addContrato(this.nuevoContrato).then(() => {
      // Alerta de éxito al guardar el contrato
      alert('Contrato guardado exitosamente.');
  
      // Resetea el formulario después de agregar el contrato
      this.nuevoContrato = {
        cliente: '',
        placa: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        numeroespacio: '',
        montoMensual: 0,
        estado: 'Disponible'
      };
  
      // Actualiza la lista de contratos
      this.obtenerContratos();
    }).catch(error => {
      console.error('Error al agregar contrato:', error);
      alert('Ocurrió un error al guardar el contrato.'); // Alerta si ocurre un error al guardar
    });
  }
  
  
}
