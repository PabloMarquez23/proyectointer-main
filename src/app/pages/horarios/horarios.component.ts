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
  horarios: Horarios[] = [];  // Array para almacenar los horarios
  nuevoHorario: Horarios = { dia: '', horainicio: '', horafin: '' };  // Objeto para un nuevo horario

  constructor(private horariosService: HorariosService) {}

  ngOnInit(): void {
    this.obtenerHorarios();  // Obtener los horarios al inicializar el componente
  }

  // Método para obtener todos los horarios desde el servicio
  obtenerHorarios() {
    this.horariosService.getHorarios().then((querySnapshot) => {
      this.horarios = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Horarios;  // Mapear los datos de Firestore a la estructura del modelo Horarios
      });
    });
  }

  // Método para agregar un nuevo horario
  agregarHorario() {
    // Validación de que el campo "Día" solo contenga letras
    const soloLetras = /^[a-zA-Z\s]+$/;
    if (!soloLetras.test(this.nuevoHorario.dia)) {
      alert("El campo 'Día' solo debe contener letras.");
      return;
    }

    // Validación de campos obligatorios (día, hora de inicio y hora de fin)
    if (!this.nuevoHorario.dia || !this.nuevoHorario.horainicio || !this.nuevoHorario.horafin) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Llamada al servicio para agregar el nuevo horario
    this.horariosService.addHorario(this.nuevoHorario).then(() => {
      alert("Horario agregado exitosamente.");
      this.nuevoHorario = { dia: '', horainicio: '', horafin: '' };  // Limpiar los campos del formulario
      this.obtenerHorarios();  // Actualizar la lista de horarios
    }).catch((error: any) => {
      console.error('Error al agregar el horario:', error);  // Mostrar error en caso de falla
    });
  }

  // Método para eliminar un horario
  eliminarHorario(id: string | undefined) {
    if (id) {
      this.horariosService.deleteHorario(id).then(() => {
        this.obtenerHorarios();  // Volver a cargar los horarios después de la eliminación
      }).catch((error: any) => {
        console.error('Error al eliminar el horario:', error);  // Mostrar error en caso de falla
      });
    } else {
      console.error('Error: El ID del horario es undefined.');  // Manejo de error si no se proporciona el ID
    }
  }

  // Método trackBy para mejorar el rendimiento al mostrar la lista de horarios
  trackById(index: number, horario: Horarios): string {
    return horario.id ? horario.id : index.toString();  // Usar el ID del horario como identificador único
  }
}
