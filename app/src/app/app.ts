import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline, arrowBackOutline, bandageOutline, calendarOutline, callOutline, chevronBackOutline,
  chevronForwardOutline, closeOutline, cutOutline, homeOutline, logOutOutline, mailOutline,
  medkitOutline, pawOutline, peopleOutline, personAddOutline, searchOutline, timeOutline,
  trashOutline, waterOutline,
} from 'ionicons/icons';

// Ícones de linha (ionicons -outline), registrados uma vez para usar com name="..."
addIcons({
  addOutline, arrowBackOutline, bandageOutline, calendarOutline, callOutline, chevronBackOutline,
  chevronForwardOutline, closeOutline, cutOutline, homeOutline, logOutOutline, mailOutline,
  medkitOutline, pawOutline, peopleOutline, personAddOutline, searchOutline, timeOutline,
  trashOutline, waterOutline,
});

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
