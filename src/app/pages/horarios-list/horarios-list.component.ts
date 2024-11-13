import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../services/horarios.service';
import { Horarios } from '../../domain/horarios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horarios-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './horarios-list.component.html',
  styleUrls: ['./horarios-list.component.scss']
})
export class HorariosListComponent implements OnInit {
  horarios: Horarios[] = [];

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

  actualizarHorario(horario: Horarios) {
    // Validación: el campo "Día" solo debe contener letras
    const soloLetras = /^[a-zA-Z\s]+$/;
    if (!soloLetras.test(horario.dia)) {
      alert("El campo 'Día' solo debe contener letras.");
      return;
    }

    // Validación de campos obligatorios
    if (!horario.dia || !horario.horainicio || !horario.horafin) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Actualizar el horario y mostrar mensaje de confirmación
    if (horario.id) {
      this.horariosService.updateHorario(horario.id, {
        dia: horario.dia,
        horainicio: horario.horainicio,
        horafin: horario.horafin
      }).then(() => {
        alert("Horario actualizado exitosamente.");
      }).catch((error: any) => {
        console.error('Error al actualizar el horario:', error);
      });
    }
  }

  eliminarHorario(id: string | undefined) {
    if (id) {
      if (confirm("¿Está seguro de que desea eliminar este horario?")) {
        this.horariosService.deleteHorario(id).then(() => {
          alert("Horario eliminado exitosamente.");
          this.obtenerHorarios();
        }).catch((error: any) => {
          console.error('Error al eliminar el horario:', error);
        });
      }
    } else {
      console.error('Error: El ID del horario es undefined.');
    }
  }

  trackById(index: number, horario: Horarios): string {
    return horario.id ? horario.id : index.toString();
  }
}
