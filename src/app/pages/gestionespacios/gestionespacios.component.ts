import { Component, OnInit } from '@angular/core';
import HomeComponent from "../home/home.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionEspacios } from '../../domain/gestionespacios';
import { GestionEspaciosService } from '../../services/gestionespacios.service';
import { ContratosService } from '../../services/contratos.service';

interface Espacio {
  id: number;
  estado: 'libre' | 'ocupado';
}

@Component({
  selector: 'app-gestionespacios',
  standalone: true,
  imports: [HomeComponent,RouterLink,CommonModule],
  templateUrl: './gestionespacios.component.html',
  styleUrl: './gestionespacios.component.scss'
})
export class GestionespaciosComponent implements OnInit{
  espacios: Espacio[] = [];

  constructor(private contratoService: ContratosService) {}

  ngOnInit(): void {
    // Inicializa todos los espacios como libres
    this.espacios = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      estado: 'libre',
    }));

    this.contratoService.obtenerContratos().subscribe((contratos) => {
      contratos.forEach((contrato) => {
        const espacioId = parseInt(contrato.numeroespacio, 10);
        const fechaActual = new Date();
        const fechaInicio = new Date(contrato.fechaInicio);
        const fechaFin = new Date(contrato.fechaFin);
    
        if (
          fechaActual >= fechaInicio &&
          fechaActual <= fechaFin &&
          contrato.estado === 'Ocupado'
        ) {
          const espacio = this.espacios.find((e) => e.id === espacioId);
          if (contrato.estado.toLowerCase() === 'ocupado') {
            const espacio = this.espacios.find((e) => e.id === espacioId);
            if (espacio) {
              espacio.estado = 'ocupado'; // Asegúrate de usar minúsculas coherentemente
            }
          }
        }
      });
    });
  }
}