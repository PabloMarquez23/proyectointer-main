import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service'; // Servicio para gestionar los contratos
import { Contratos } from '../../domain/contratos'; // Interfaz que define la estructura de los contratos
import HomeComponent from '../home/home.component'; // Componente de inicio
import { FormsModule } from '@angular/forms'; // Módulo de formularios para manejo de ngModel
import { CommonModule } from '@angular/common'; // Módulo Angular para funcionalidades comunes
import { ActivatedRoute, RouterLink } from '@angular/router'; // Módulo para navegación entre rutas

@Component({
  selector: 'app-contratos', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [HomeComponent, FormsModule, CommonModule, RouterLink], // Módulos y componentes importados
  templateUrl: './contratos.component.html', // Ruta del archivo de plantilla
  styleUrls: ['./contratos.component.scss'] // Ruta del archivo de estilos
})
export class ContratosComponent implements OnInit {
  contratos: Contratos[] = [];
  nuevoContrato: Contratos = {
    cliente: '',
    placa: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    numeroespacio: '',
    montoMensual: 0,
    estado: 'Disponible',
  };

  constructor(
    private contratosService: ContratosService,
    private route: ActivatedRoute // Inyectar ActivatedRoute para acceder al parámetro
  ) {}

  ngOnInit(): void {
    // Obtener el número de espacio de la ruta
    const numeroEspacio = this.route.snapshot.paramMap.get('numeroEspacio');
    if (numeroEspacio) {
      this.nuevoContrato.numeroespacio = numeroEspacio; // Cargar el espacio en el formulario
    }

    this.obtenerContratos();
  }

  obtenerContratos() {
    this.contratosService.getContratos().then((querySnapshot) => {
      this.contratos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as Contratos;
      });
    });
  }

  agregarContrato() {
    if (!this.nuevoContrato.cliente || !this.nuevoContrato.numeroespacio || !this.nuevoContrato.montoMensual) {
      alert('Todos los campos obligatorios deben llenarse.');
      return;
    }

    this.contratosService.addContrato(this.nuevoContrato).then(() => {
      alert('Contrato guardado correctamente.');
      this.nuevoContrato = {
        cliente: '',
        placa: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        numeroespacio: '',
        montoMensual: 0,
        estado: 'Disponible',
      };
      this.obtenerContratos();
    });
  }
}
  
  

