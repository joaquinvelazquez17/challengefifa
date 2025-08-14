import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  standalone: true,
  imports: [RouterModule],
})
export class MenuComponent {
  constructor(private auth: Auth, private router: Router) { }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  async players() {
    this.router.navigate(['/players']);
  }

  async createPlayer() {
    this.router.navigate(['/create-player']);
  }
}
