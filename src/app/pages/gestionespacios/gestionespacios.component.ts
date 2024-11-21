import { Component, OnInit } from '@angular/core';
import HomeComponent from "../home/home.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionEspacios } from '../../domain/gestionespacios';
import { GestionEspaciosService } from '../../services/gestionespacios.service';
import { ContratosService } from '../../services/contratos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestionespacios',
  standalone: true,
  imports: [HomeComponent, RouterLink, CommonModule, FormsModule], // Importa los módulos necesarios
  templateUrl: './gestionespacios.component.html',
  styleUrls: ['./gestionespacios.component.scss'] // Vincula el archivo de estilos CSS
})
export class GestionespaciosComponent implements OnInit {
  espacios: GestionEspacios[] = []; // Lista de espacios existentes
  contratos: any[] = []; // Lista de contratos cargados
  estadoEspacios: { [key: number]: string } = {}; // Relación espacio-estado (espacio: estado)
  espacioSeleccionado: number | null = null; // Espacio seleccionado para eliminar

  constructor(
    private espaciosService: GestionEspaciosService,
    private contratosService: ContratosService
  ) {}

  ngOnInit(): void {
    this.obtenerEspacios(); // Cargar espacios al iniciar
    this.obtenerContratos(); // Cargar contratos para verificar estados
  }

  // Obtener los espacios desde Firestore
  obtenerEspacios() {
    this.espaciosService.getEspacios().then((querySnapshot) => {
      this.espacios = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as GestionEspacios; // Asegúrate de incluir el ID del documento
      }).sort((a, b) => a.espacio - b.espacio); // Ordenar los espacios por número
  
      // Actualizar el estado de los espacios una vez cargados
      this.actualizarEstadoEspacios();
    }).catch((error) => {
      console.error('Error al obtener los espacios:', error);
    });
  }

  // Obtener los contratos desde Firestore
  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      this.contratos = querySnapshot.docs.map((doc) => doc.data());
      this.actualizarEstadoEspacios(); // Actualizar estados después de cargar contratos
    });
  }

  // Actualizar el estado de cada espacio basado en los contratos
  actualizarEstadoEspacios() {
    this.espacios.forEach((espacio) => {
      // Buscar un contrato con el número de espacio actual
      const contrato = this.contratos.find(
        (c) => c.numeroespacio === String(espacio.espacio)
      );

      // Asignar el estado correspondiente o 'Disponible' por defecto
      this.estadoEspacios[espacio.espacio] = contrato ? contrato.estado : 'Disponible';
    });
  }

  // Añadir un nuevo espacio automáticamente
  agregarEspacio() {
    const ultimoEspacio = this.espacios.length > 0 ? this.espacios[this.espacios.length - 1].espacio : 0;
    const nuevoEspacio: GestionEspacios = { espacio: ultimoEspacio + 1 };

    this.espaciosService.addEspacio(nuevoEspacio).then(() => {
      alert('Espacio añadido correctamente');
      this.obtenerEspacios(); // Actualizar la lista
    });
  }

  // Eliminar un espacio si no está vinculado a ningún contrato
eliminarEspacio() {
  if (this.espacioSeleccionado === null) {
    alert('Por favor selecciona un espacio para eliminar.');
    return;
  }

  // Verificar si el espacio está vinculado a algún contrato
  const espacioEnContrato = this.contratos.some(
    (contrato) => contrato.numeroespacio === String(this.espacioSeleccionado)
  );

  if (espacioEnContrato) {
    alert('No se puede eliminar este espacio porque está vinculado a un contrato.');
    return;
  }

  // Obtener el espacio por su número
  const espacio = this.espacios.find((e) => e.espacio === this.espacioSeleccionado);

  if (espacio?.id) {
    this.espaciosService
      .deleteEspacio(espacio.id) // Eliminar en Firestore usando el ID correcto
      .then(() => {
        alert(`El espacio ${this.espacioSeleccionado} fue eliminado correctamente.`);
        this.espacioSeleccionado = null; // Reiniciar la selección
        this.obtenerEspacios(); // Actualizar la lista
      })
      .catch((error) => {
        console.error('Error al eliminar el espacio:', error);
        alert('Ocurrió un error al intentar eliminar el espacio. Intenta de nuevo.');
      });
  } else {
    alert('No se encontró el espacio seleccionado. Verifica la selección.');
  }
}
}
