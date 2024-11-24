import { Component, OnInit } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service';
import { Tarifas } from '../../domain/tarifas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tarifas-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './tarifas-list.component.html',
  styleUrls: ['./tarifas-list.component.scss']
})
export class TarifasListComponent implements OnInit {
  tarifas: Tarifas[] = []; // Lista de tarifas obtenidas desde el servicio

  constructor(private tarifasService: TarifasService) {}

  ngOnInit(): void {
    // Cargar las tarifas al iniciar el componente
    this.obtenerTarifas();
  }

  /**
   * Método para obtener las tarifas desde el servicio.
   * Los datos son convertidos en objetos del tipo Tarifas.
   */
  obtenerTarifas() {
    this.tarifasService.getTarifas().then((querySnapshot) => {
      this.tarifas = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Tarifas;
      });
    });
  }

  /**
   * Método para actualizar una tarifa.
   * Incluye validaciones para los campos antes de realizar la actualización.
   * @param tarifa - Objeto tarifa que se desea actualizar.
   */
  actualizarTarifa(tarifa: Tarifas) {
    // Validar que el nombre de la tarifa no contenga números
    const tieneNumeros = /\d/.test(tarifa.nombretarifa);
    if (tieneNumeros) {
      alert("El nombre de la tarifa no debe contener números.");
      return;
    }

    // Validar que todos los campos sean obligatorios y válidos
    if (!tarifa.nombretarifa || tarifa.costo <= 0 || tarifa.duracion <= 0) {
      alert("Por favor, complete todos los campos obligatorios con valores válidos.");
      return;
    }

    // Confirmación de actualización
    const confirmacion = confirm("¿Estás seguro de que deseas actualizar esta tarifa?");
    if (confirmacion && tarifa.id) {
      this.tarifasService.updateTarifa(tarifa.id, {
        nombretarifa: tarifa.nombretarifa,
        costo: tarifa.costo,
        duracion: tarifa.duracion
      }).then(() => {
        alert("Tarifa actualizada exitosamente.");
      }).catch((error: any) => {
        console.error('Error al actualizar la tarifa:', error);
      });
    }
  }

  /**
   * Método para eliminar una tarifa.
   * Muestra una confirmación antes de proceder con la eliminación.
   * @param id - ID de la tarifa a eliminar.
   */
  eliminarTarifa(id: string | undefined) {
    if (id) {
      // Confirmación de eliminación
      const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta tarifa?");
      if (confirmacion) {
        this.tarifasService.deleteTarifa(id).then(() => {
          this.obtenerTarifas(); // Actualizar la lista después de eliminar
          alert("Tarifa eliminada exitosamente.");
        }).catch((error: any) => {
          console.error('Error al eliminar la tarifa:', error);
        });
      }
    } else {
      console.error('Error: El ID de la tarifa es undefined.');
    }
  }

  /**
   * Método para optimizar la renderización de la lista de tarifas.
   * Se utiliza para rastrear cada elemento con un identificador único.
   * @param index - Índice del elemento en la lista.
   * @param tarifa - Objeto tarifa actual.
   * @returns El ID de la tarifa o el índice como cadena.
   */
  trackById(index: number, tarifa: Tarifas): string {
    return tarifa.id ? tarifa.id : index.toString();
  }
}
