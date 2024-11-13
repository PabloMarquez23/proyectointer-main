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

  actualizarContrato(contrato: Contratos) {
    if (contrato.id) {
      this.contratosService.updateContrato(contrato.id, {
        cliente: contrato.cliente,
        direccion: contrato.direccion,
        fechaInicio: contrato.fechaInicio,
        fechaFin: contrato.fechaFin,
        numeroespacio: contrato.numeroespacio,
        montoMensual: contrato.montoMensual
      }).then(() => {
        console.log('Contrato actualizado');
      }).catch((error: any) => {
        console.error('Error al actualizar el contrato:', error);
      });
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
