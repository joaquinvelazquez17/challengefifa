import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Hacemos público el observable para que otros componentes se suscriban
  public loggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  async login(usuario: string, password: string): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = { usuario, password };

    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, body, { headers, withCredentials: true })
      );
      this.setLoggedIn(true);
    } catch (error) {
      console.error('Error en login:', error);
      this.setLoggedIn(false);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      );
      this.setLoggedIn(false);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.baseUrl}/me`, { withCredentials: true })
      );
      return true;
    } catch {
      return false;
    }
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  async checkAuth() {
    const logged = await this.isLoggedIn();
    this.setLoggedIn(logged);
  }
}
