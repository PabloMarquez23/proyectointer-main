import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service';
import { Contratos } from '../../domain/contratos';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import HomeComponent from "../home/home.component";

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HomeComponent],
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.scss']
})
export class ContratosListComponent implements OnInit {
  contratos: Contratos[] = [];

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

  // Método para actualizar un contrato con validaciones
  actualizarContrato(contrato: Contratos) {
    // Validación de los campos requeridos
    if (!contrato.cliente || !contrato.numeroespacio || !contrato.montoMensual) {
      if (!contrato.cliente) {
        alert('El nombre del cliente es obligatorio.');
      }
      if (!contrato.numeroespacio) {
        alert('El número de espacio es obligatorio.');
      }
      if (!contrato.montoMensual) {
        alert('El monto mensual es obligatorio.');
      }
      return;
    }

    // Validación: El nombre del cliente no debe contener números
    const regexNombreCliente = /^[A-Za-z\s]+$/;
    if (!regexNombreCliente.test(contrato.cliente)) {
      alert('El nombre del cliente no debe contener números.');
      return;
    }

    // Validación: La fecha de inicio debe ser antes de la fecha de fin
    if (contrato.fechaInicio >= contrato.fechaFin) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }

    // Validación: El número de espacio debe ser un número
    if (isNaN(Number(contrato.numeroespacio))) {
      alert('El número de espacio debe ser un número válido.');
      return;
    }

    // Validación: El monto mensual debe ser un número positivo
    if (isNaN(contrato.montoMensual) || contrato.montoMensual <= 0) {
      alert('El monto mensual debe ser un número positivo.');
      return;
    }

    // Si todas las validaciones son correctas, procede con la actualización
    if (contrato.id) {
      this.contratosService.updateContrato(contrato.id, {
        cliente: contrato.cliente,
        placa: contrato.placa,
        fechaInicio: contrato.fechaInicio,
        fechaFin: contrato.fechaFin,
        numeroespacio: contrato.numeroespacio,
        montoMensual: contrato.montoMensual,
        estado: contrato.estado
      }).then(() => {
        alert('Contrato actualizado exitosamente.');
      }).catch((error: any) => {
        console.error('Error al actualizar el contrato:', error);
        alert('Ocurrió un error al actualizar el contrato.');
      });
    }
  }

  // Método para eliminar un contrato con validación
  eliminarContrato(id: string | undefined) {
    if (!id) {
      alert('Error: El ID del contrato es obligatorio para eliminar.');
      return;
    }

    // Confirmación antes de eliminar el contrato
    if (confirm('¿Estás seguro de que deseas eliminar este contrato?')) {
      this.contratosService.deleteContrato(id).then(() => {
        this.obtenerContratos();
        alert('Contrato eliminado exitosamente.');
      }).catch((error: any) => {
        console.error('Error al eliminar el contrato:', error);
        alert('Ocurrió un error al eliminar el contrato.');
      });
    }
  }

  trackById(index: number, contrato: Contratos): string {
    return contrato.id ? contrato.id : index.toString();
  }
}
