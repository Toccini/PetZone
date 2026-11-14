import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { AuthShellComponent } from '../../../shared/components/auth-shell/auth-shell.component';
import { showInvalid } from '../../../shared/utils/form-errors';

const passwordsMatch: ValidatorFn = (group) =>
  group.get('password')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cpf: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  show = (name: string) => showInvalid(this.form.get(name));
  mismatch = () => this.form.hasError('mismatch') && this.form.controls.confirmPassword.touched;
  confirmInvalid = () => this.show('confirmPassword') || this.mismatch();

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const { confirmPassword, cpf, ...rest } = this.form.getRawValue();
      const user = await this.auth.register({ ...rest, cpf: cpf || undefined });
      await this.router.navigateByUrl(this.auth.homeRoute(user.role));
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Não foi possível criar a conta. Tente de novo.');
    } finally {
      this.loading.set(false);
    }
  }
}