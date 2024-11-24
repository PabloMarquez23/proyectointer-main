import { Component, OnInit } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service'; // Servicio para gestionar tarifas
import { Tarifas } from '../../domain/tarifas'; // Interfaz para definir el modelo de datos de las tarifas
import HomeComponent from '../home/home.component'; // Componente del encabezado o barra de navegación
import { FormsModule } from '@angular/forms'; // Módulo para el uso de formularios y binding bidireccional
import { CommonModule } from '@angular/common'; // Módulo para funcionalidades comunes de Angular
import { RouterLink } from '@angular/router'; // Directiva para la navegación entre rutas

@Component({
  selector: 'app-tarifas', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink], // Módulos y componentes importados
  templateUrl: './tarifas.component.html', // Archivo de plantilla asociado
  styleUrls: ['./tarifas.component.scss'] // Archivo de estilos asociado
})
export class TarifasComponent implements OnInit {
  tarifas: Tarifas[] = []; // Arreglo para almacenar las tarifas existentes
  nuevaTarifa: Tarifas = { nombretarifa: '', costo: 0, duracion: 0 }; // Modelo para una nueva tarifa

  constructor(private tarifasService: TarifasService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerTarifas(); // Carga las tarifas al iniciar
  }

  // Método para obtener todas las tarifas desde el servicio
  obtenerTarifas() {
    this.tarifasService.getTarifas().then((querySnapshot) => {
      // Convierte los datos obtenidos a un arreglo de objetos Tarifas
      this.tarifas = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as Tarifas;
      });
    });
  }

  // Método para agregar una nueva tarifa
  agregarTarifa() {
    // Validar que el nombre de la tarifa no contenga números
    const tieneNumeros = /\d/.test(this.nuevaTarifa.nombretarifa);
    if (tieneNumeros) {
      alert("El nombre de la tarifa no debe contener números.");
      return; // Salir si la validación falla
    }

    // Validar que todos los campos sean obligatorios y tengan valores válidos
    if (!this.nuevaTarifa.nombretarifa || this.nuevaTarifa.costo <= 0 || this.nuevaTarifa.duracion <= 0) {
      alert("Por favor, complete todos los campos obligatorios con valores válidos.");
      return; // Salir si la validación falla
    }

    // Guardar la tarifa utilizando el servicio
    this.tarifasService.addTarifa(this.nuevaTarifa).then(() => {
      // Reiniciar el formulario
      this.nuevaTarifa = { nombretarifa: '', costo: 0, duracion: 0 };
      this.obtenerTarifas(); // Actualizar la lista de tarifas
      alert("Tarifa guardada exitosamente."); // Confirmación al usuario
    });
  }
}
