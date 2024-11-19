import { Component } from '@angular/core'; // Importación del decorador Component de Angular
import HomeComponent from '../home/home.component'; // Importación del componente Home (probablemente para la navegación)
import { RouterLink } from '@angular/router'; // Importación de RouterLink para la navegación
import { AuthService } from '../../core/services/auth.service'; // Importación del servicio de autenticación
import { UserData } from '../../core/services/auth.service'; // Importación de la clase UserData (presumiblemente para manejar los datos del usuario)
import { getAuth, updatePassword } from 'firebase/auth'; // Importación de funciones de Firebase Auth para actualizar la contraseña

import { MensajeService } from '../../services/mensaje.service'; // Importación de servicio de mensajes para mostrar notificaciones
import { users } from '../../domain/users'; // Importación del modelo de datos 'users'
import { FormsModule } from '@angular/forms'; // Importación del módulo de formularios para usar ngModel

@Component({
  selector: 'app-edi-perfil', // Selector para el componente
  standalone: true, // Indica que el componente es autónomo y no necesita un módulo adicional
  imports: [HomeComponent, RouterLink, FormsModule], // Importación de otros componentes y módulos necesarios
  templateUrl: './edi-perfil.component.html', // Ruta al archivo HTML del componente
  styleUrl: './edi-perfil.component.scss' // Ruta al archivo de estilos SCSS
})

export class EdiPerfilComponent {
  task: any; // Variable para almacenar las tareas (aunque no se usa mucho aquí)
  message: string | null = null; // Propiedad para almacenar mensajes que se mostrarán al usuario
  usuario: users = new users(); // Instancia del modelo 'users', que se vincula a los datos del usuario
  
  // Inyección del servicio MensajeService en el constructor
  constructor(private tareasService: MensajeService) {}

  // Método que carga los datos del usuario actual desde el servicio
  cargarUsuario() {
    this.tareasService.getCurrentUser().then((userData: any) => {
      this.usuario = userData; // Asigna los datos del usuario al modelo 'usuario'
    }).catch(error => {
      console.log('Error al cargar usuario', error); // Manejo de errores si no se puede cargar el usuario
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.cargarUsuario(); // Llama al método para cargar los datos del usuario
  }
  
  // Método para recargar la página
  recargarPagina() {
    window.location.reload(); // Recarga la página completa
  }

  // Método para eliminar una tarea o registro
  borrar(taskId: string) {
    this.tareasService.deleteTasks1(taskId).then(() => {
      console.log('Documento eliminado'); // Confirma la eliminación
      this.message = 'Se ha eliminado correctamente'; // Muestra un mensaje de éxito
      this.task = this.task.filter((book: any) => book.id !== taskId); // Filtra la tarea eliminada de la lista
      this.guardar(); // Guarda los cambios
      this.recargarPagina(); // Recarga la página
      setTimeout(() => this.message = null, 3000); // Oculta el mensaje después de 3 segundos
    }).catch(error => {
      console.log('Error al eliminar', error); // Maneja errores al eliminar la tarea
    });
  }

  // Método para guardar los cambios del usuario
  guardar() {
    if (this.usuario.id) { // Si el usuario tiene un ID, se actualiza
      // Actualiza los datos del usuario en Firestore
      this.tareasService.updateTask1(this.usuario.id, this.usuario)
        .then(() => {
          console.log('Usuario actualizado en Firestore');
  
          // Si se ha proporcionado una nueva contraseña, se actualiza también en Firebase Auth
          if (this.usuario.contrasenia) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              updatePassword(user, this.usuario.contrasenia) // Actualiza la contraseña en Firebase Auth
                .then(() => {
                  console.log('Contraseña actualizada en Firebase Auth');
                  this.message = 'Usuario y contraseña actualizados correctamente'; // Mensaje de éxito
                })
                .catch(error => {
                  console.log('Error al actualizar contraseña:', error); // Manejo de errores si la actualización de la contraseña falla
                  this.message = 'Error al actualizar la contraseña'; // Mensaje de error
                });
            } else {
              console.log('No hay usuario autenticado');
              this.message = 'No se pudo actualizar la contraseña'; // Si no hay usuario autenticado
            }
          } else {
            this.message = 'Usuario actualizado correctamente'; // Mensaje si no se actualiza la contraseña
          }
        })
        .catch(error => {
          console.log('Error al actualizar usuario:', error); // Manejo de errores al actualizar el usuario
          this.message = 'Error al actualizar el usuario'; // Mensaje de error si la actualización falla
        });
    } else {
      // Si no tiene ID, se guarda un nuevo documento en Firestore
      this.tareasService.addTask1(this.usuario)
        .then(() => {
          console.log('Usuario guardado');
          this.message = 'Usuario guardado correctamente'; // Mensaje de éxito
        })
        .catch(error => {
          console.log('Error al guardar usuario:', error); // Manejo de errores al guardar un nuevo usuario
        });
    }
  }
}
