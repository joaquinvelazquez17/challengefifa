import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu';
import { Auth } from './services/auth/auth';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, MenuComponent, CommonModule],
})
export class App implements OnInit, OnDestroy {
  isLoggedIn = false;
  private subscription?: Subscription;

  constructor(private auth: Auth) { }

  ngOnInit() {
    // Verificamos el estado de autenticación al iniciar
    this.auth.checkAuth();

    // Nos suscribimos a cambios de estado de login
    this.subscription = this.auth.loggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
