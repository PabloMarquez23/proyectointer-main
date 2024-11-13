import { Component, OnInit } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service';
import { Tarifas } from '../../domain/tarifas';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink],
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
        return { id: doc.id, ...data } as Tarifas;
      });
    });
  }

  agregarTarifa() {
    // Validar que el campo nombretarifa no tenga números
    const tieneNumeros = /\d/.test(this.nuevaTarifa.nombretarifa);
    if (tieneNumeros) {
      alert("El nombre de la tarifa no debe contener números.");
      return;
    }

    // Validar que todos los campos sean obligatorios y válidos
    if (!this.nuevaTarifa.nombretarifa || this.nuevaTarifa.costo <= 0 || this.nuevaTarifa.duracion <= 0) {
      alert("Por favor, complete todos los campos obligatorios con valores válidos.");
      return;
    }

    // Guardar la tarifa y mostrar mensaje de confirmación
    this.tarifasService.addTarifa(this.nuevaTarifa).then(() => {
      this.nuevaTarifa = { nombretarifa: '', costo: 0, duracion: 0 };
      this.obtenerTarifas();
      alert("Tarifa guardada exitosamente.");
    });
  }
}
