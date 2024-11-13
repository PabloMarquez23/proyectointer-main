import { Component, OnInit } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service';
import { Tarifas } from '../../domain/tarifas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tarifas-list',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './tarifas-list.component.html',
  styleUrls: ['./tarifas-list.component.scss']
})
export class TarifasListComponent implements OnInit {
  tarifas: Tarifas[] = [];

  constructor(private tarifasService: TarifasService) {}

  ngOnInit(): void {
    this.obtenerTarifas();
  }

  obtenerTarifas() {
    this.tarifasService.getTarifas().then((querySnapshot) => {
      this.tarifas = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Tarifas;
      });
    });
  }

  actualizarTarifa(tarifa: Tarifas) {
    if (tarifa.id) {
      this.tarifasService.updateTarifa(tarifa.id, {
        nombretarifa: tarifa.nombretarifa,
        costo: tarifa.costo,
        duracion: tarifa.duracion
      }).then(() => {
        console.log('Tarifa actualizada');
      }).catch((error: any) => {
        console.error('Error al actualizar la tarifa:', error);
      });
    }
  }

  eliminarTarifa(id: string | undefined) {
    if (id) {
      this.tarifasService.deleteTarifa(id).then(() => {
        this.obtenerTarifas();
      });
    } else {
      console.error('Error: El ID de la tarifa es undefined.');
    }
  }

  trackById(index: number, tarifa: Tarifas): string {
    return tarifa.id ? tarifa.id : index.toString();
  }
}