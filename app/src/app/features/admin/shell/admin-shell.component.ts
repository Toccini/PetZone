import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';

/** Painel do admin: faixa escura com marca, navegação (Agenda, Clientes) e "Sair" */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterLink, RouterLinkActive, IonHeader, IonIcon, IonRouterOutlet],
  template: `
    <ion-header class="admin-header">
      <div class="band-dark bar">
        <div class="bar__inner">
          <a class="brand" routerLink="/admin/schedule">
            <img class="brand__logo" src="/img/petzone-logo.png" alt="PetZone" width="180" height="38" />
            <span class="bar__tag">Balcão</span>
          </a>
          <nav aria-label="Painel do administrador">
            <a routerLink="/admin/schedule" routerLinkActive="is-active" ariaCurrentWhenActive="page">
              <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>Agenda
            </a>
            <a routerLink="/admin/clients" routerLinkActive="is-active" ariaCurrentWhenActive="page">
              <ion-icon name="people-outline" aria-hidden="true"></ion-icon>Clientes
            </a>
          </nav>
          <button type="button" class="btn btn--ghost-dark" (click)="logout()">
            <ion-icon name="log-out-outline" aria-hidden="true"></ion-icon>Sair
          </button>
        </div>
      </div>
    </ion-header>
    <ion-router-outlet class="admin-outlet"></ion-router-outlet>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    .admin-header { box-shadow: none; }
    .bar { padding-top: env(safe-area-inset-top, 0px); }
    .bar__inner {
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
      max-width: 1200px; margin: 0 auto; padding: 8px 24px; box-sizing: border-box; min-height: 64px;
    }
    .brand { color: #fff; background: transparent; padding: 8px 0; }
    .bar__tag {
      margin-left: 4px; padding: 4px 10px; color: var(--color-brand); border: 1px solid var(--color-brand); border-radius: 9999px;
      font: 600 12px/1 var(--font-ui); letter-spacing: .015em;
    }
    nav { display: flex; gap: 4px; margin: 0 auto; }
    nav a {
      display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px;
      border-radius: 9999px; color: rgba(255,255,255,.75); text-decoration: none;
      font: 500 16px/1 var(--font-ui); transition: opacity 150ms ease;
    }
    nav a:hover { color: #fff; }
    nav a.is-active { background: #fff; color: #1f1f1f; }
    nav a:focus-visible, .brand:focus-visible, button:focus-visible { outline-color: #fff; }
    nav ion-icon { font-size: 20px; }
    .admin-outlet { position: relative; flex: 1; }
    @media (max-width: 560px) {
      nav { order: 3; width: 100%; justify-content: center; margin: 0; }
      .bar__inner { justify-content: space-between; }
    }
  `,
})
export class AdminShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
