import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Públicas (quem já está logado vai direto para a sua home)
  { path: 'login', title: 'Entrar · PetShop', canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', title: 'Criar conta · PetShop', canActivate: [guestGuard], loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', title: 'Esqueci minha senha · PetShop', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', title: 'Nova senha · PetShop', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },

  // Administrador: faixa escura com navegação (Agenda, Clientes)
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./features/admin/shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'schedule' },
      { path: 'schedule', title: 'Agenda · PetShop', loadComponent: () => import('./features/admin/schedule/schedule.component').then(m => m.ScheduleComponent) },
      { path: 'clients', title: 'Clientes · PetShop', loadComponent: () => import('./features/admin/client-form/client-form.component').then(m => m.ClientFormComponent) },
    ],
  },

  // Cliente: barra de abas inferior (Início, Meus pets, Agendar)
  {
    path: 'client',
    canActivate: [roleGuard('CLIENT')],
    loadComponent: () => import('./features/client/tabs/client-tabs.component').then(m => m.ClientTabsComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', title: 'Início · PetShop', loadComponent: () => import('./features/client/home/home.component').then(m => m.HomeComponent) },
      { path: 'pets', title: 'Meus pets · PetShop', loadComponent: () => import('./features/client/pets/pets.component').then(m => m.PetsComponent) },
      { path: 'booking', title: 'Agendar serviço · PetShop', loadComponent: () => import('./features/client/booking/booking.component').then(m => m.BookingComponent) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
