import { Component } from '@angular/core';
import HomeComponent from '../home/home.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserData } from '../../core/services/auth.service';
import { getAuth, updatePassword } from 'firebase/auth';



import { MensajeService } from '../../services/mensaje.service';

import { users } from '../../domain/users';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edi-perfil',
  standalone: true,
  imports: [HomeComponent, RouterLink, FormsModule],
  templateUrl: './edi-perfil.component.html',
  styleUrl: './edi-perfil.component.scss'
})

export class EdiPerfilComponent {
  
  task: any;
  message: string | null = null; // Añadir la propiedad message
  usuario : users = new users()
  
  constructor(private tareasService: MensajeService) {}

  cargarUsuario() {
    this.tareasService.getCurrentUser().then((userData: any) => {
      this.usuario = userData;
    }).catch(error => {
      console.log('Error al cargar usuario', error);
    });
  }

  ngOnInit() {
    this.cargarUsuario();
  }
  
  recargarPagina() {
    window.location.reload(); // Método para recargar la página
  }

  borrar(taskId: string) {
   
    
    // Eliminar el registro después de guardar
    this.tareasService.deleteTasks1(taskId).then(() => {
      console.log('Documento eliminado');
      this.message = 'Se ha eliminado correctamente';
      this.task = this.task.filter((book: any) => book.id !== taskId);
      this.guardar();
this.recargarPagina();
      setTimeout(() => this.message = null, 3000); // Ocultar mensaje después de 3 segundos
    }).catch(error => {
      console.log('Error al eliminar', error);
    });
  }

  // EdiPerfilComponent

  guardar() {
    if (this.usuario.id) {
      // Actualizar en Firestore
      this.tareasService.updateTask1(this.usuario.id, this.usuario)
        .then(() => {
          console.log('Usuario actualizado en Firestore');
  
          // Si se ha proporcionado una nueva contraseña, actualizar en Firebase Auth
          if (this.usuario.contrasenia) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              updatePassword(user, this.usuario.contrasenia)
                .then(() => {
                  console.log('Contraseña actualizada en Firebase Auth');
                  this.message = 'Usuario y contraseña actualizados correctamente';
                })
                .catch(error => {
                  console.log('Error al actualizar contraseña:', error);
                  this.message = 'Error al actualizar la contraseña';
                });
            } else {
              console.log('No hay usuario autenticado');
              this.message = 'No se pudo actualizar la contraseña';
            }
          } else {
            this.message = 'Usuario actualizado correctamente';
          }
        })
        .catch(error => {
          console.log('Error al actualizar usuario:', error);
          this.message = 'Error al actualizar el usuario';
        });
    } else {
      // Guardar un nuevo documento en Firestore si no tiene ID
      this.tareasService.addTask1(this.usuario)
        .then(() => {
          console.log('Usuario guardado');
          this.message = 'Usuario guardado correctamente';
        })
        .catch(error => {
          console.log('Error al guardar usuario:', error);
        });
    }
  }
  
  

  
}
