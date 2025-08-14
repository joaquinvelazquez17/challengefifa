import { Component } from '@angular/core';
import { Auth } from '../../services/auth/auth';
@Component({
  selector: 'app-login',
  template: `
    <form (submit)="onSubmit($event)">
      <input type="text" placeholder="Usuario" [(ngModel)]="usuario" name="usuario" required />
      <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
      <button type="submit">Login</button>
    </form>
    <p *ngIf="errorMessage" style="color:red">{{ errorMessage }}</p>
  `,
})
export class LoginComponent {
  usuario = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth) { }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    try {
      await this.auth.login(this.usuario, this.password);
      alert('Login exitoso!');
      // Redirigir o actualizar UI
    } catch (e) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
