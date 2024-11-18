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

  // Método para obtener los contratos
  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      this.contratos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Contratos;
      });
    });
  }

  // Método para validar los campos
  validarCampos(contrato: Contratos): boolean {
    const clienteValido = /^[a-zA-Z\s]+$/.test(contrato.cliente); // Solo letras y espacios
    const espacioValido = /^[0-9]+$/.test(contrato.numeroespacio); // Solo números

    if (!clienteValido) {
      alert("El campo 'Cliente' solo puede contener letras.");
      return false;
    }

    if (!espacioValido) {
      alert("El campo 'Número de espacio' solo puede contener números.");
      return false;
    }

    // Verificar que todos los campos sean obligatorios
    if (!contrato.cliente || !contrato.placa || !contrato.fechaInicio || !contrato.fechaFin || !contrato.numeroespacio || !contrato.montoMensual || !contrato.estado) {
      alert("Todos los campos son obligatorios.");
      return false;
    }

    return true;
  }

  // Método para actualizar un contrato
  actualizarContrato(contrato: Contratos) {
    if (this.validarCampos(contrato)) {
      if (confirm("¿Estás seguro de que deseas actualizar este contrato?")) {
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
            console.log('Contrato actualizado');
          }).catch((error: any) => {
            console.error('Error al actualizar el contrato:', error);
          });
        }
      }
    }
  }

  // Método para eliminar un contrato
  eliminarContrato(id: string | undefined) {
    if (id) {
      if (confirm("¿Estás seguro de que deseas eliminar este contrato?")) {
        this.contratosService.deleteContrato(id).then(() => {
          this.obtenerContratos();
        });
      }
    } else {
      console.error('Error: El ID del contrato es undefined.');
    }
  }

  // Método para identificar cada contrato
  trackById(index: number, contrato: Contratos): string {
    return contrato.id ? contrato.id : index.toString();
  }
}
