import { Component, OnInit, inject } from '@angular/core';

// Importa los módulos de Angular Material para crear una barra de herramientas y botones
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

// Módulos comunes de Angular
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

// Servicio de autenticación
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

// Importación de tipos relacionados con la autenticación de Firebase
import { User, user } from '@angular/fire/auth';

@Component({
  selector: 'app-home', // Define el selector para este componente
  standalone: true, // Es un componente independiente que puede ser usado sin necesidad de ser declarado en un módulo
  imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterLink, RouterOutlet], // Importa módulos necesarios para el funcionamiento del componente
  templateUrl: './home.component.html', // Archivo HTML asociado
  styleUrl: './home.component.scss', // Estilos CSS asociados
})
export default class HomeComponent implements OnInit {

  // Inyección de dependencias: el enrutador de Angular y el servicio de autenticación
  private _router = inject(Router);
  private authservice = inject(AuthService);

  // Propiedad para gestionar el estado del menú
  public active: boolean = false;

  // Indica si el usuario tiene rol de administrador
  isAdmin: boolean = false;

  // Función para cerrar sesión del usuario
  async logOut(): Promise<void> {
    try {
      // Llama al método logOut del servicio de autenticación
      await this.authservice.logOut();
      // Redirige al usuario a la página de inicio de sesión
      this._router.navigateByUrl('/auth/log-in');
    } catch (error) {
      console.log(error); // En caso de error, se muestra en la consola
    }
  }

  // Constructor del componente, donde se inyecta el servicio de autenticación
  constructor(private authService: AuthService) { }

  // Al inicializar el componente, se suscribe al estado de autenticación del usuario
  ngOnInit(): void {
    this.authService.authState$.subscribe((user: User | null) => { 
      // Si el usuario está autenticado
      if (user) {
        // Se obtiene el rol del usuario mediante su uid
        this.authService.getUserRole(user.uid).subscribe(role => {
          // Si el rol es 'admin', se establece la variable isAdmin en true
          this.isAdmin = role === 'admin';
        });
      } else {
        // Si el usuario no está autenticado, se establece isAdmin en false
        this.isAdmin = false;
      }
    });
  }

  // Método para alternar el estado del menú (abierto/cerrado)
  toggleMenu() {
    this.active = !this.active;
  }
}
