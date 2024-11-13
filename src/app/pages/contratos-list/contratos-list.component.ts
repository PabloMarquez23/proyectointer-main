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

  // Método para validar los campos
  validarCampos(contrato: Contratos): boolean {
    // Validación de que el nombre del cliente no tenga números
    const clienteValido = /^[A-Za-z ]+$/.test(contrato.cliente);
    if (!clienteValido) {
      alert('El nombre del cliente no puede contener números.');
      return false;
    }

    // Validación de que el número de espacio sea un número válido
    const numeroEspacioValido = !isNaN(Number(contrato.numeroespacio)) && contrato.numeroespacio.trim() !== '';
    if (!numeroEspacioValido) {
      alert('El número de espacio debe ser un número válido.');
      return false;
    }

    // Verificación de que todos los campos sean obligatorios
    if (
      !contrato.cliente || 
      !contrato.direccion || 
      !contrato.fechaInicio || 
      !contrato.fechaFin || 
      !contrato.numeroespacio || 
      !contrato.montoMensual || 
      contrato.montoMensual < 0
    ) {
      alert('Todos los campos son obligatorios y deben ser válidos.');
      return false;
    }

    return true;
  }

  // Método para actualizar el contrato
  actualizarContrato(contrato: Contratos) {
    if (this.validarCampos(contrato)) {
      if (window.confirm('¿Estás seguro de que deseas actualizar este contrato?')) {
        if (contrato.id) {
          this.contratosService.updateContrato(contrato.id, {
            cliente: contrato.cliente,
            direccion: contrato.direccion,
            fechaInicio: contrato.fechaInicio,
            fechaFin: contrato.fechaFin,
            numeroespacio: contrato.numeroespacio,
            montoMensual: contrato.montoMensual
          }).then(() => {
            alert('Contrato actualizado correctamente');
            this.obtenerContratos();  // Actualizamos la lista de contratos
          }).catch((error: any) => {
            alert('Error al actualizar el contrato');
            console.error('Error al actualizar contrato:', error);
          });
        }
      }
    }
  }

  // Método para eliminar el contrato
  eliminarContrato(id: string | undefined) {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contrato?')) {
      if (id) {
        this.contratosService.deleteContrato(id).then(() => {
          alert('Contrato eliminado correctamente');
          this.obtenerContratos();  // Actualizamos la lista de contratos
        }).catch((error: any) => {
          alert('Error al eliminar el contrato');
          console.error('Error al eliminar contrato:', error);
        });
      } else {
        alert('Error: El ID del contrato es undefined.');
      }
    }
  }

  trackById(index: number, contrato: Contratos): string {
    return contrato.id ? contrato.id : index.toString();
  }
}
