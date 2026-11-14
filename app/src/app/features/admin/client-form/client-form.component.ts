import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { ApiService, apiError } from '../../../core/services/api';
import { Client } from '../../../core/models/appointment.model';
import { showInvalid } from '../../../shared/utils/form-errors';

/** Clientes (admin): cadastro no balcão + lista com busca */
@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, IonContent, IonIcon],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements ViewWillEnter {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private searchTimer?: ReturnType<typeof setTimeout>;

  saving = signal(false);
  formError = signal('');
  message = signal('');

  query = signal('');
  loading = signal(true);
  listError = signal('');
  clients = signal<Client[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    cpf: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  show = (name: string) => showInvalid(this.form.get(name));

  ionViewWillEnter() {
    this.search();
  }

  onQuery(value: string) {
    this.query.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.search(), 300);
  }

  async search() {
    this.loading.set(true);
    this.listError.set('');
    try {
      this.clients.set(await this.api.clients(this.query().trim()));
    } catch (e) {
      this.listError.set(apiError(e, 'Não foi possível carregar os clientes.'));
    } finally {
      this.loading.set(false);
    }
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.message.set('');
    try {
      const { cpf, ...rest } = this.form.getRawValue();
      const client = await this.api.createClient({ ...rest, cpf: cpf || undefined });
      this.clients.update((list) => [client, ...list]);
      this.form.reset();
      this.message.set(`${client.name} foi cadastrado. Passe a senha provisória para o cliente.`);
    } catch (e) {
      this.formError.set(apiError(e, 'Não foi possível cadastrar o cliente.'));
    } finally {
      this.saving.set(false);
    }
  }

  initial = (name: string) => name.trim().charAt(0).toUpperCase();
  phoneHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`;
}
