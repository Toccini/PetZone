import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-auth-shell',
  imports: [IonContent, IonIcon, RouterLink],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
})
export class AuthShellComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  back = input<string | null>(null);
}