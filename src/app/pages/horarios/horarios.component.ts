import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../services/horarios.service';
import { Horarios } from '../../domain/horarios';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
})
export class HorariosComponent implements OnInit {
  horarios: Horarios[] = [];
  nuevoHorario: Horarios = { dia: '', horainicio: '', horafin: '' };

  constructor(private horariosService: HorariosService) {}

  ngOnInit(): void {
    this.obtenerHorarios();
  }

  obtenerHorarios() {
    this.horariosService.getHorarios().then((querySnapshot) => {
      this.horarios = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Horarios;
      });
    });
  }

  agregarHorario() {
    // Validación para que el campo "Día" solo contenga letras
    const soloLetras = /^[a-zA-Z\s]+$/;
    if (!soloLetras.test(this.nuevoHorario.dia)) {
      alert("El campo 'Día' solo debe contener letras.");
      return;
    }

    // Validación de campos obligatorios
    if (!this.nuevoHorario.dia || !this.nuevoHorario.horainicio || !this.nuevoHorario.horafin) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Agregar el horario y mostrar mensaje de confirmación
    this.horariosService.addHorario(this.nuevoHorario).then(() => {
      alert("Horario agregado exitosamente.");
      this.nuevoHorario = { dia: '', horainicio: '', horafin: '' };
      this.obtenerHorarios();
    }).catch((error: any) => {
      console.error('Error al agregar el horario:', error);
    });
  }

  eliminarHorario(id: string | undefined) {
    if (id) {
      this.horariosService.deleteHorario(id).then(() => {
        this.obtenerHorarios();
      }).catch((error: any) => {
        console.error('Error al eliminar el horario:', error);
      });
    } else {
      console.error('Error: El ID del horario es undefined.');
    }
  }

  trackById(index: number, horario: Horarios): string {
    return horario.id ? horario.id : index.toString();
  }
}
