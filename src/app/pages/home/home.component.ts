import { Component, OnInit, inject } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';

import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User, user } from '@angular/fire/auth';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule , MatButtonModule,CommonModule, RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss', 
  
})
export default class HomeComponent implements OnInit{

  private _router = inject(Router);

  private authservice = inject(AuthService);
  public active: boolean = false;
  isAdmin: boolean = false;
  async logOut(): Promise<void> {
    try {
      await this.authservice.logOut();
      this._router.navigateByUrl('/auth/log-in');
    } catch (error) {
      console.log(error);
    }
  }
 
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authState$.subscribe((user: User | null) => { // Declara el tipo explícito
      if (user) {
        this.authService.getUserRole(user.uid).subscribe(role => {
          this.isAdmin = role === 'admin';
        });
      } else {
        this.isAdmin = false;
      }
    });
  }

  toggleMenu() {
    this.active = !this.active;
  }



}