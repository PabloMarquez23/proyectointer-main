import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service';
import { Contratos } from '../../domain/contratos';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
  contratos: Contratos[] = [];
  nuevoContrato: Contratos = {
    cliente: '',
    placa: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    numeroespacio: '',
    montoMensual: 0,
    estado: ''
  };

  constructor(private contratosService: ContratosService) {}

  ngOnInit(): void {
    this.obtenerContratos();
  }

  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      this.contratos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log({ id: doc.id, ...data });
        return { id: doc.id, ...data } as Contratos;
      });
    });
  }

  agregarContrato() {
    if (this.nuevoContrato.cliente && this.nuevoContrato.numeroespacio && this.nuevoContrato.montoMensual >= 0) {
      this.contratosService.addContrato(this.nuevoContrato).then(() => {
        this.nuevoContrato = {
          cliente: '',
          placa: '',
          fechaInicio: new Date(),
          fechaFin: new Date(),
          numeroespacio: '',
          montoMensual: 0,
          estado: 'Disponible'  // Asegúrate de que este campo esté configurado
        };
        this.obtenerContratos();
      }).catch(error => {
        console.error('Error al agregar contrato:', error);
      });
    } else {
      console.warn('Por favor, completa todos los campos obligatorios.');
    }
  }

  eliminarContrato(id: string | undefined) {
    if (id) {
      this.contratosService.deleteContrato(id).then(() => {
        this.obtenerContratos();
      });
    } else {
      console.error('Error: El ID del contrato es undefined.');
    }
  }

  trackById(index: number, contrato: Contratos): string {
    return contrato.id ? contrato.id : index.toString();
  }
}
