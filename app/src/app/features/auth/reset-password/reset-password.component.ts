import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { AuthShellComponent } from '../../../shared/components/auth-shell/auth-shell.component';
import { showInvalid } from '../../../shared/utils/form-errors';

const passwordsMatch: ValidatorFn = (group) =>
  group.get('newPassword')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  token = inject(ActivatedRoute).snapshot.queryParamMap.get('token');

  loading = signal(false);
  done = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  show = (name: string) => showInvalid(this.form.get(name));
  mismatch = () => this.form.hasError('mismatch') && this.form.controls.confirmPassword.touched;
  confirmInvalid = () => this.show('confirmPassword') || this.mismatch();

  async submit() {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.resetPassword(this.token, this.form.getRawValue().newPassword);
      this.done.set(true);
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Não foi possível salvar a senha. Tente de novo.');
    } finally {
      this.loading.set(false);
    }
  }
}