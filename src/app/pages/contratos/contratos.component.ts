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
        return { id: doc.id, ...data } as Contratos;
      });
    });
  }

  agregarContrato() {
    // Validación de campos
    if (!this.nuevoContrato.cliente || !this.nuevoContrato.placa || !this.nuevoContrato.numeroespacio || !this.nuevoContrato.montoMensual) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación del nombre (no debe contener números)
    const nombreValido = /^[A-Za-z\s]+$/.test(this.nuevoContrato.cliente);
    if (!nombreValido) {
      alert('El nombre del cliente no debe contener números.');
      return;
    }

    // Validación de espacio (debe ser un número)
    const numeroEspacioValido = /^[0-9]+$/.test(this.nuevoContrato.numeroespacio);
    if (!numeroEspacioValido) {
      alert('El número de espacio debe ser un número válido.');
      return;
    }

    // Validación de monto mensual (debe ser mayor o igual a cero)
    if (this.nuevoContrato.montoMensual < 0) {
      alert('El monto mensual no puede ser negativo.');
      return;
    }

    // Agregar el contrato si las validaciones pasan
    this.contratosService.addContrato(this.nuevoContrato).then(() => {
      alert('Contrato agregado exitosamente.');
      this.nuevoContrato = {
        cliente: '',
        placa: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        numeroespacio: '',
        montoMensual: 0,
        estado: 'Disponible'
      };
      this.obtenerContratos();
    }).catch(error => {
      console.error('Error al agregar contrato:', error);
    });
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
