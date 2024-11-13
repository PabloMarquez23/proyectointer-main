import { Component } from '@angular/core';
import HomeComponent from '../home/home.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [HomeComponent, RouterLink],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export default class PrincipalComponent {

}
