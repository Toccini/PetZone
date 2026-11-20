import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';

/** Cabeçalho das telas do cliente: marca à esquerda, "Sair" à direita */
@Component({
  selector: 'app-client-header',
  imports: [IonIcon],
  template: `
    <header class="app-header">
      <span class="brand"><img class="brand__logo" src="/img/petzone-logo.png" alt="PetZone" width="180" height="38" /></span>
      <button type="button" class="btn btn--ghost" (click)="logout()">
        <ion-icon name="log-out-outline" aria-hidden="true"></ion-icon>Sair
      </button>
    </header>
  `,
  styles: `
    .app-header { min-height: 56px; }
  `,
})
export class ClientHeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
