import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

/** Área do cliente: barra de abas inferior (Início, Meus pets, Agendar) */
@Component({
  selector: 'app-client-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" aria-label="Navegação principal">
        <ion-tab-button tab="home">
          <ion-icon name="home-outline" aria-hidden="true"></ion-icon>
          <ion-label>Início</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="pets">
          <ion-icon name="paw-outline" aria-hidden="true"></ion-icon>
          <ion-label>Meus pets</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="booking">
          <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
          <ion-label>Agendar</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: `
    ion-tab-bar {
      --border: 1px solid #c9c9cd;
      min-height: 64px;
      padding: 6px 0 calc(env(safe-area-inset-bottom, 0px) + 6px);
      box-shadow: none;
    }
    ion-tab-button {
      --color: #717173;
      --color-selected: #1f1f1f;
      min-height: 44px;
    }
    ion-tab-button ion-icon {
      font-size: 24px;
    }
    ion-label {
      margin: 4px 0 0;
      line-height: 16px;
      font: 500 12px/1 var(--font-ui);
    }
  `,
})
export class ClientTabsComponent {}
