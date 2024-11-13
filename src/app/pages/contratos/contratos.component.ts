import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service';
import { Contratos } from '../../domain/contratos';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';  // Importamos para los mensajes

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
    direccion: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    numeroespacio: '',
    montoMensual: 0
  };

  constructor(
    private contratosService: ContratosService,
    private _snackBar: MatSnackBar  // Inyectamos el MatSnackBar
  ) {}

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
    // Validación de que el nombre del cliente no tenga números
    const clienteValido = /^[A-Za-z ]+$/.test(this.nuevoContrato.cliente);
    if (!clienteValido) {
      this.openSnackBar('El nombre del cliente no puede contener números.');
      return;
    }
  
    // Validación de que el número de espacio sea un número válido
    const numeroEspacioValido = !isNaN(Number(this.nuevoContrato.numeroespacio)) && this.nuevoContrato.numeroespacio.trim() !== '';
    if (!numeroEspacioValido) {
      this.openSnackBar('El número de espacio debe ser un número válido.');
      return;
    }
  
    // Verificación de que todos los campos obligatorios estén completos
    if (
      !this.nuevoContrato.cliente || 
      !this.nuevoContrato.direccion || 
      !this.nuevoContrato.fechaInicio || 
      !this.nuevoContrato.fechaFin || 
      !this.nuevoContrato.numeroespacio || 
      !this.nuevoContrato.montoMensual || 
      this.nuevoContrato.montoMensual < 0
    ) {
      this.openSnackBar('Todos los campos son obligatorios y deben ser válidos.');
      return;
    }
  
    // Si todas las validaciones son correctas, agregamos el contrato
    this.contratosService.addContrato(this.nuevoContrato).then(() => {
      // Reiniciamos el formulario después de agregar el contrato
      this.nuevoContrato = {
        cliente: '',
        direccion: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        numeroespacio: '',
        montoMensual: 0
      };
  
      // Mensaje de éxito
      this.openSnackBar('Contrato agregado correctamente');
      this.obtenerContratos(); // Actualizamos la lista de contratos
    }).catch((error) => {
      // En caso de error al agregar
      this.openSnackBar('Error al agregar el contrato');
      console.error('Error al agregar contrato:', error);
    });
  }
  

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
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
