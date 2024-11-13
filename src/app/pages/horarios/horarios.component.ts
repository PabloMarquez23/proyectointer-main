import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../services/horarios.service';
import { Horarios } from '../../domain/horarios';
import HomeComponent from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horarios',
  standalone: true,  // Agrega esta línea
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink],  // Aquí importa FormsModule y HomeComponent
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
        console.log({ id: doc.id, ...data }); // Verifica los datos en la consola
        return { id: doc.id, ...data } as Horarios;
      });
    });
  }

  agregarHorario() {
    if (this.nuevoHorario.dia && this.nuevoHorario.horainicio && this.nuevoHorario.horafin) {
      this.horariosService.addHorario(this.nuevoHorario).then(() => {
        this.nuevoHorario = { dia: '', horainicio: '', horafin: '' };
        this.obtenerHorarios();
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
    return horario.id ? horario.id : index.toString(); // Usa el índice si `id` no está presente
  }
}
