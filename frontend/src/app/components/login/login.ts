import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  usuario = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) { }

  async onSubmit() {
    try {
      await this.auth.login(this.usuario, this.password);
      // No guardamos token aquí, ya está en cookie HttpOnly
      this.router.navigate(['/players']); // ruta después de login
    } catch (err) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      console.error('Login error', err);
    }
  }
}
