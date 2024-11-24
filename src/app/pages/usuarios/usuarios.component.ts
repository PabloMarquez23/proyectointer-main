import { Component, OnInit } from '@angular/core';  // Importación del módulo core de Angular y el ciclo de vida OnInit
import { MensajeService } from '../../services/mensaje.service';  // Importación del servicio para manejar las tareas
import HomeComponent from '../home/home.component';  // Importación del componente Home
import { RouterLink } from '@angular/router';  // Importación de RouterLink para navegación
import { users } from '../../domain/users';  // Importación de la clase users, probablemente para tipo de datos de los usuarios
import { FormsModule } from '@angular/forms';  // Importación del módulo de formularios de Angular para trabajar con ngModel

@Component({
  selector: 'app-usuarios',  // Selector para usar este componente en HTML
  standalone: true,  // Habilita el componente como independiente, sin necesidad de ser parte de un módulo
  imports: [HomeComponent, RouterLink, FormsModule],  // Módulos importados para usar en el componente
  templateUrl: './usuarios.component.html',  // Ubicación del archivo HTML para la vista del componente
  styleUrls: ['./usuarios.component.scss']  // Ubicación del archivo de estilos para este componente
})
export class UsuariosComponent implements OnInit {
  // Atributos del componente
  task: any;  // Variable para almacenar la lista de usuarios
  message: string | null = null;  // Variable para almacenar mensajes de estado (por ejemplo, confirmación de éxito)
  usuario: users = new users();  // Instancia de un usuario nuevo, basada en la clase users

  constructor(private tareasService: MensajeService) {}  // Inyección del servicio MensajeService en el constructor

  // Método que se ejecuta cuando el componente es inicializado
  ngOnInit() {
    // Llamada al servicio para obtener las tareas (usuarios) y transformarlas en el formato adecuado
    this.tareasService.getTasks1().then(data => {
      this.task = data.docs.map((doc: any) => {
        return {
          id: doc.id,  // Extrae el ID de cada documento
          ...doc.data()  // Extrae los datos del documento y los asigna a la variable task
        };
      });
    });
  }

  // Método para validar que todos los campos necesarios están llenos
  validarCampos(user: any): boolean {
    // Verifica si alguno de los campos del usuario está vacío
    if (!user.email || !user.names || !user.lastName || !user.role) {
      alert('Todos los campos son obligatorios');  // Muestra una alerta si falta algún campo
      return false;
    }
    // Verifica si el correo electrónico tiene el carácter "@"
    if (!user.email.includes('@')) {
      alert('El email debe contener "@"');  // Muestra una alerta si el email no es válido
      return false;
    }
    return true;  // Retorna verdadero si los campos son válidos
  }

  // Método para guardar los cambios de un usuario después de validar los campos
  editarUsuario(user: any) {
    // Si los campos son válidos, procede a actualizar los datos del usuario
    if (this.validarCampos(user)) {
      this.tareasService.updateTask1(user.id, user).then(() => {
        this.message = 'Usuario actualizado correctamente';  // Muestra un mensaje de éxito
        setTimeout(() => this.message = null, 3000);  // Limpia el mensaje después de 3 segundos
        alert('Cambios guardados correctamente');  // Muestra una alerta confirmando que los cambios se guardaron
      }).catch(error => {
        console.error('Error al actualizar el usuario', error);  // Captura y muestra cualquier error en la consola
      });
    }
  }

  // Método para eliminar un usuario
  borrar(taskId: string) {
    // Muestra una confirmación para verificar si el usuario realmente desea eliminar
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      this.tareasService.deleteTasks1(taskId).then(() => {
        this.message = 'Se ha eliminado correctamente';  // Muestra un mensaje de éxito
        // Filtra la lista de usuarios para eliminar el usuario que se acaba de borrar
        this.task = this.task.filter((usuario: any) => usuario.id !== taskId);
        setTimeout(() => this.message = null, 3000);  // Limpia el mensaje después de 3 segundos
        alert('Usuario eliminado correctamente');  // Muestra una alerta confirmando que el usuario fue eliminado
      }).catch(error => {
        console.log('Error al eliminar', error);  // Captura y muestra cualquier error en la consola
      });
    }
  }
}
