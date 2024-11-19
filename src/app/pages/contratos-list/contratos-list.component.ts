import { Component, OnInit } from '@angular/core'; // Importación del decorador Component y la interfaz OnInit de Angular
import { ContratosService } from '../../services/contratos.service'; // Importación del servicio que gestiona los contratos
import { Contratos } from '../../domain/contratos'; // Importación de la clase/entidad Contratos
import { FormsModule } from '@angular/forms'; // Importación del módulo de formularios para usar ngModel
import { CommonModule } from '@angular/common'; // Importación de módulos comunes de Angular
import { RouterLink } from '@angular/router'; // Importación del RouterLink para la navegación
import HomeComponent from "../home/home.component"; // Importación del componente Home

@Component({
  selector: 'app-contratos-list', // El nombre del selector para este componente
  standalone: true, // Este componente es autónomo, no depende de un módulo raíz (Angular 14+)
  imports: [FormsModule, CommonModule, RouterLink, HomeComponent], // Importación de módulos que utiliza este componente
  templateUrl: './contratos-list.component.html', // Ruta al archivo HTML de la plantilla
  styleUrls: ['./contratos-list.component.scss'] // Ruta al archivo de estilos CSS/SCSS
})
export class ContratosListComponent implements OnInit {
  contratos: Contratos[] = []; // Array que almacena los contratos

  // Inyección del servicio ContratosService en el constructor
  constructor(private contratosService: ContratosService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerContratos(); // Obtiene la lista de contratos cuando el componente se inicializa
  }

  // Método para obtener la lista de contratos desde el servicio
  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      // Al recibir los datos, mapeamos los documentos y los convertimos en objetos de tipo Contratos
      this.contratos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Contratos; // Asignamos el ID del documento y sus datos
      });
    });
  }

  // Método para actualizar un contrato
  actualizarContrato(contrato: Contratos) {
    if (contrato.id) { // Comprobamos si el contrato tiene un ID
      this.contratosService.updateContrato(contrato.id, {
        cliente: contrato.cliente,
        placa: contrato.placa,
        fechaInicio: contrato.fechaInicio,
        fechaFin: contrato.fechaFin,
        numeroespacio: contrato.numeroespacio,
        montoMensual: contrato.montoMensual,
        estado: contrato.estado // Estado actualizado del contrato
      }).then(() => {
        console.log('Contrato actualizado'); // Confirmación de éxito en la actualización
      }).catch((error: any) => {
        console.error('Error al actualizar el contrato:', error); // Manejo de errores si algo sale mal
      });
    }
  }

  // Método para eliminar un contrato
  eliminarContrato(id: string | undefined) {
    if (id) { // Comprobamos que el ID no sea undefined
      this.contratosService.deleteContrato(id).then(() => {
        this.obtenerContratos(); // Recargamos la lista de contratos después de la eliminación
      });
    } else {
      console.error('Error: El ID del contrato es undefined.'); // Si no hay ID, mostramos un mensaje de error
    }
  }

  // Método para optimizar la renderización de la lista de contratos
  trackById(index: number, contrato: Contratos): string {
    // Usamos el ID del contrato para rastrear cada elemento, lo que mejora el rendimiento al actualizar la lista
    return contrato.id ? contrato.id : index.toString();
  }
}
