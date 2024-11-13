import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import HomeComponent from './pages/home/home.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, HomeComponent,FormsModule]
})
export class AppComponent {
  title = 'angualar-proyectodcu';
}