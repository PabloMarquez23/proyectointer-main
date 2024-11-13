import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EdiPerfilComponent } from './pages/edi-perfil/edi-perfil.component';
import PrincipalComponent from './pages/principal/principal.component';
import LogInComponent from './pages/auth/log-in/log-in.component';
import SignUpComponent from './pages/auth/sign-up/sign-up.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { adminGuard } from './auth/admin.guard';
import { AdminGuard } from './core/guards/adminn.guard';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { TarifasComponent } from './pages/tarifas/tarifas.component';
import { GestionespaciosComponent } from './pages/gestionespacios/gestionespacios.component';
import HomeComponent from './pages/home/home.component';
import { HorariosComponent } from './pages/horarios/horarios.component';
import { TarifasListComponent } from './pages/tarifas-list/tarifas-list.component';
import { HorariosListComponent } from './pages/horarios-list/horarios-list.component';
import { ContratosListComponent } from './pages/contratos-list/contratos-list.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/principal/principal.component'),
  },
  
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'sign-up',
        loadComponent: () => import('./pages/auth/sign-up/sign-up.component'),
      },
      {
        path: 'log-in',
        loadComponent: () => import('./pages/auth/log-in/log-in.component'),
      },
    ],
  },
  { path: 'perfil', title: 'editar', component: PerfilComponent, canActivate: [AdminGuard] },
  { path: 'edi-perfil', title: 'eliminar', component: EdiPerfilComponent },
  { path: 'principal', title: 'principal', component: PrincipalComponent },
  { path: 'usuarios', title: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
  { path: 'contratos', title: 'contratos', component: ContratosComponent, canActivate: [AdminGuard] },
  { path: 'contratos-list', title: 'gestionar contratos', component: ContratosListComponent, canActivate: [AdminGuard] },
  { path: 'tarifas', title: 'tarifas', component: TarifasComponent, canActivate: [AdminGuard] },
  { path: 'gestionespacios', title: 'gestionespacios', component: GestionespaciosComponent, canActivate: [AdminGuard] },
  { path: 'horarios', title: 'horarios', component: HorariosComponent, canActivate: [AdminGuard] },
  { path: 'tarifas-list', title: 'gestionar tarifas', component: TarifasListComponent, canActivate: [AdminGuard] },
  { path: 'horarios-list', title: 'Gestionar Horarios', component: HorariosListComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/tarifas', pathMatch: 'full' },
  { path: '**', redirectTo: '/tarifas' },
];
