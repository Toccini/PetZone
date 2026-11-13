import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonSpinner } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonButton, IonSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      const user = await this.auth.login(email, password);
      await this.router.navigateByUrl(this.auth.homeRoute(user.role));
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Não foi possível entrar. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}