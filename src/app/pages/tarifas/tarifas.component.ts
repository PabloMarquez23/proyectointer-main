import { Component, OnInit } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service';
import { Tarifas } from '../../domain/tarifas';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tarifas',
  standalone: true,  // Agrega esta línea
  imports: [HomeComponent, FormsModule,CommonModule,RouterLink],  // Aquí importa FormsModule y HomeComponent
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.scss']
})
export class TarifasComponent implements OnInit {
  tarifas: Tarifas[] = [];
  nuevaTarifa: Tarifas = { nombretarifa: '', costo: 0, duracion: 0 };

  constructor(private tarifasService: TarifasService) {}

  ngOnInit(): void {
    this.obtenerTarifas();
  }

  obtenerTarifas() {
    this.tarifasService.getTarifas().then((querySnapshot) => {
      this.tarifas = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log({ id: doc.id, ...data }); // Verifica los datos en la consola
        return { id: doc.id, ...data } as Tarifas;
      });
    });
  }

  agregarTarifa() {
    if (this.nuevaTarifa.nombretarifa && this.nuevaTarifa.costo >= 0 && this.nuevaTarifa.duracion >= 0) {
      this.tarifasService.addTarifa(this.nuevaTarifa).then(() => {
        this.nuevaTarifa = { nombretarifa: '', costo: 0, duracion: 0 };
        this.obtenerTarifas();
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
    return tarifa.id ? tarifa.id : index.toString(); // Usa el índice si `id` no está presente
  }
}