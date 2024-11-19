import { Component, OnInit } from '@angular/core';
import HomeComponent from "../home/home.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionEspacios } from '../../domain/gestionespacios';
import { GestionEspaciosService } from '../../services/gestionespacios.service';
import { ContratosService } from '../../services/contratos.service';

// Interfaz que representa un espacio de parqueo con su id y estado (libre u ocupado)
interface Espacio {
  id: number; // Identificador único del espacio
  estado: 'libre' | 'ocupado'; // Estado del espacio (puede ser 'libre' o 'ocupado')
}

@Component({
  selector: 'app-gestionespacios',
  standalone: true,
  imports: [HomeComponent, RouterLink, CommonModule], // Importa los módulos necesarios
  templateUrl: './gestionespacios.component.html',
  styleUrls: ['./gestionespacios.component.scss'] // Vincula el archivo de estilos CSS
})
export class GestionespaciosComponent implements OnInit {
  espacios: Espacio[] = []; // Lista de espacios de parqueo

  constructor(private contratoService: ContratosService) {}

  ngOnInit(): void {
    // Inicializa todos los espacios como 'libre' y los asigna a la propiedad 'espacios'
    this.espacios = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1, // Los ID de los espacios van del 1 al 16
      estado: 'libre', // Todos los espacios inicialmente están libres
    }));

    // Llama al servicio para obtener los contratos
    this.contratoService.obtenerContratos().subscribe((contratos) => {
      // Recorre cada contrato para actualizar los espacios según su estado
      contratos.forEach((contrato) => {
        const espacioId = parseInt(contrato.numeroespacio, 10); // Convierte el número de espacio en entero
        const fechaActual = new Date(); // Obtiene la fecha actual
        const fechaInicio = new Date(contrato.fechaInicio); // Convierte la fecha de inicio del contrato
        const fechaFin = new Date(contrato.fechaFin); // Convierte la fecha de fin del contrato
    
        // Verifica si el contrato está en vigencia y si su estado es 'Ocupado'
        if (
          fechaActual >= fechaInicio && // Fecha actual dentro del rango del contrato
          fechaActual <= fechaFin && // Fecha actual antes de la fecha de fin
          contrato.estado === 'Ocupado' // El contrato debe estar marcado como 'Ocupado'
        ) {
          // Busca el espacio correspondiente al ID del contrato
          const espacio = this.espacios.find((e) => e.id === espacioId);
          if (contrato.estado.toLowerCase() === 'ocupado') { // Verifica si el contrato está ocupado
            if (espacio) {
              espacio.estado = 'ocupado'; // Cambia el estado del espacio a 'ocupado'
            }
          }
        }
      });
    });
  }
}
