import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { User, UserRole } from '../models/user.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  private _token = signal<string | null>(null);
  private _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly role = computed<UserRole | null>(() => this._user()?.role ?? null);

  /** Chamado na inicialização do app: recarrega a sessão salva */
  async restore(): Promise<void> {
    const t = await Preferences.get({ key: TOKEN_KEY });
    const u = await Preferences.get({ key: USER_KEY });
    if (t.value && u.value) {
      this._token.set(t.value);
      this._user.set(JSON.parse(u.value));
    }
  }

  async login(email: string, password: string): Promise<User> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, password })
    );
    await this.saveSession(res);
    return res.user;
  }

  async register(data: {
    name: string; email: string; phone: string; cpf?: string; password: string;
  }): Promise<User> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.api}/auth/register`, data)
    );
    await this.saveSession(res);
    return res.user;
  }

  forgotPassword(email: string) {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${this.api}/auth/forgot-password`, { email })
    );
  }

  resetPassword(token: string, newPassword: string) {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${this.api}/auth/reset-password`, { token, newPassword })
    );
  }

  async logout(): Promise<void> {
    this._token.set(null);
    this._user.set(null);
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
  }

  homeRoute(role: UserRole | null = this.role()): string {
    return role === 'ADMIN' ? '/admin/schedule' : '/client/home';
  }

  private async saveSession(res: AuthResponse) {
    this._token.set(res.token);
    this._user.set(res.user);
    await Preferences.set({ key: TOKEN_KEY, value: res.token });
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(res.user) });
  }
}