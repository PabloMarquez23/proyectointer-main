import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../services/horarios.service';
import { Horarios } from '../../domain/horarios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horarios-list', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [FormsModule, CommonModule, RouterLink], // Módulos importados para el funcionamiento del componente
  templateUrl: './horarios-list.component.html', // Ruta de la plantilla HTML del componente
  styleUrls: ['./horarios-list.component.scss'] // Ruta del archivo de estilos
})
export class HorariosListComponent implements OnInit {
  // Lista de horarios a mostrar en la interfaz
  horarios: Horarios[] = [];

  // Constructor: inyecta el servicio de horarios
  constructor(private horariosService: HorariosService) {}

  /**
   * Método del ciclo de vida Angular: se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.obtenerHorarios(); // Obtiene los horarios al cargar el componente
  }

  /**
   * Obtiene la lista de horarios desde el servicio.
   * Realiza una consulta y mapea los datos obtenidos en un arreglo.
   */
  obtenerHorarios() {
    this.horariosService.getHorarios().then((querySnapshot) => {
      this.horarios = querySnapshot.docs.map(doc => {
        const data = doc.data(); // Obtiene los datos del documento
        return { id: doc.id, ...data } as Horarios; // Combina el ID con los datos
      });
    });
  }

  /**
   * Actualiza un horario seleccionado.
   * Realiza validaciones de entrada antes de actualizar el horario en el servicio.
   * @param horario - Objeto horario a actualizar
   */
  actualizarHorario(horario: Horarios) {
    // Validación: el campo "Día" solo debe contener letras
    const soloLetras = /^[a-zA-Z\s]+$/;
    if (!soloLetras.test(horario.dia)) {
      alert("El campo 'Día' solo debe contener letras."); // Muestra un mensaje de error
      return; // Sale de la función
    }

    // Validación de campos obligatorios
    if (!horario.dia || !horario.horainicio || !horario.horafin) {
      alert("Por favor, complete todos los campos obligatorios."); // Mensaje de advertencia
      return;
    }

    // Actualiza el horario en la base de datos
    if (horario.id) {
      this.horariosService.updateHorario(horario.id, {
        dia: horario.dia,
        horainicio: horario.horainicio,
        horafin: horario.horafin
      }).then(() => {
        alert("Horario actualizado exitosamente."); // Mensaje de éxito
      }).catch((error: any) => {
        console.error('Error al actualizar el horario:', error); // Manejo de errores
      });
    }
  }

  /**
   * Elimina un horario seleccionado por ID.
   * Muestra una confirmación antes de eliminar el horario.
   * @param id - ID del horario a eliminar
   */
  eliminarHorario(id: string | undefined) {
    if (id) {
      if (confirm("¿Está seguro de que desea eliminar este horario?")) {
        this.horariosService.deleteHorario(id).then(() => {
          alert("Horario eliminado exitosamente."); // Mensaje de éxito
          this.obtenerHorarios(); // Actualiza la lista después de eliminar
        }).catch((error: any) => {
          console.error('Error al eliminar el horario:', error); // Manejo de errores
        });
      }
    } else {
      console.error('Error: El ID del horario es undefined.'); // Manejo de casos inválidos
    }
  }

  /**
   * Método de seguimiento para optimizar el rendimiento del *ngFor.
   * @param index - Índice del elemento en el array
   * @param horario - Objeto horario actual
   * @returns El ID del horario o el índice como fallback
   */
  trackById(index: number, horario: Horarios): string {
    return horario.id ? horario.id : index.toString(); // Retorna el ID o el índice
  }
}
