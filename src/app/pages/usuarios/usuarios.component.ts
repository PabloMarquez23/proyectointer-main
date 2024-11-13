import { Component, OnInit } from '@angular/core';
import { MensajeService } from '../../services/mensaje.service';
import HomeComponent from '../home/home.component';
import { RouterLink } from '@angular/router';
import { users } from '../../domain/users';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HomeComponent, RouterLink, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  task: any;
  message: string | null = null;
  usuario: users = new users();

  constructor(private tareasService: MensajeService) {}

  ngOnInit() {
    this.tareasService.getTasks1().then(data => {
      this.task = data.docs.map((doc: any) => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
    });
  }

  // Validar que todos los campos estén llenos
  validarCampos(user: any): boolean {
    if (!user.email || !user.names || !user.lastName || !user.role) {
      alert('Todos los campos son obligatorios');
      return false;
    }
    if (!user.email.includes('@')) {
      alert('El email debe contener "@"');
      return false;
    }
    return true;
  }

  // Guardar cambios con validación y confirmación
  editarUsuario(user: any) {
    if (this.validarCampos(user)) {
      this.tareasService.updateTask1(user.id, user).then(() => {
        this.message = 'Usuario actualizado correctamente';
        setTimeout(() => this.message = null, 3000); // Ocultar mensaje después de 3 segundos
        alert('Cambios guardados correctamente');
      }).catch(error => {
        console.error('Error al actualizar el usuario', error);
      });
    }
  }

  borrar(taskId: string) {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      this.tareasService.deleteTasks1(taskId).then(() => {
        this.message = 'Se ha eliminado correctamente';
        this.task = this.task.filter((usuario: any) => usuario.id !== taskId);
        setTimeout(() => this.message = null, 3000);
        alert('Usuario eliminado correctamente');
      }).catch(error => {
        console.log('Error al eliminar', error);
      });
    }
  }
}
