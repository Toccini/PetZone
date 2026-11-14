import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { AuthShellComponent } from '../../../shared/components/auth-shell/auth-shell.component';
import { showInvalid } from '../../../shared/utils/form-errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  show = (name: string) => showInvalid(this.form.get(name));

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
      this.error.set(e?.error?.message ?? 'Não foi possível entrar. Verifique sua conexão e tente de novo.');
    } finally {
      this.loading.set(false);
    }
  }
}