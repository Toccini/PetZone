import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonSpinner } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonButton, IonSpinner],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cpf: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { confirmPassword, cpf, ...rest } = this.form.getRawValue();
    if (rest.password !== confirmPassword) {
      this.error.set('As senhas não coincidem.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    try {
      const user = await this.auth.register({ ...rest, cpf: cpf || undefined });
      await this.router.navigateByUrl(this.auth.homeRoute(user.role));
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Não foi possível cadastrar. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}