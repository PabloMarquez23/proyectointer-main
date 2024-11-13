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
    if (horario.id) {
      this.horariosService.updateHorario(horario.id, {
        dia: horario.dia,
        horainicio: horario.horainicio,
        horafin: horario.horafin
      }).then(() => {
        console.log('Horario actualizado');
      }).catch((error: any) => {
        console.error('Error al actualizar el horario:', error);
      });
    }
  }

  eliminarHorario(id: string | undefined) {
    if (id) {
      this.horariosService.deleteHorario(id).then(() => {
        this.obtenerHorarios();
      });
    } else {
      console.error('Error: El ID del horario es undefined.');
    }
  }

  trackById(index: number, horario: Horarios): string {
    return horario.id ? horario.id : index.toString();
  }
}
