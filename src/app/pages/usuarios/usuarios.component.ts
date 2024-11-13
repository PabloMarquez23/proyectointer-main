import { Component } from '@angular/core';
import { MensajeService } from '../../services/mensaje.service';
import HomeComponent from '../home/home.component';
import { RouterLink } from '@angular/router';
import { users } from '../../domain/users';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HomeComponent, RouterLink,FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  task: any;
  message: string | null = null; // Añadir la propiedad message
  usuario : users = new users()
  
  constructor(private tareasService: MensajeService) {}

  guardar(usuarioModificado: any) {
    this.tareasService.updateTask1(usuarioModificado.id, usuarioModificado)
      .then(() => {
        this.message = 'Usuario actualizado correctamente';
        setTimeout(() => this.message = null, 3000);
      })
      .catch(error => {
        console.log('Error al actualizar', error);
      });
  }

 // Método para editar un usuario específico
 editarUsuario(user: any) {
  // Aquí llamamos a un método del servicio para actualizar el usuario en la base de datos
  this.tareasService.updateTask1(user.id, user).then(() => {
    console.log('Usuario actualizado correctamente');
    this.message = 'Usuario actualizado correctamente';
    setTimeout(() => this.message = null, 3000); // Ocultar mensaje después de 3 segundos
  }).catch(error => {
    console.error('Error al actualizar el usuario', error);
  });
}

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
  recargarPagina() {
    window.location.reload(); // Método para recargar la página
  }
  borrar(taskId: string) {
    this.tareasService.deleteTasks1(taskId).then(() => {
      console.log('Documento eliminado');
      this.message = 'Se ha eliminado correctamente';
      this.task = this.task.filter((usuario: any) => usuario.id !== taskId);
      setTimeout(() => this.message = null, 3000);
    }).catch(error => {
      console.log('Error al eliminar', error);
    });
  }
 
}
