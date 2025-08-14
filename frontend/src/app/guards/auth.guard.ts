import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth/auth'; // Ajusta la ruta si es necesario

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) { }

    async canActivate(): Promise<boolean> {
        const loggedIn = await this.auth.isLoggedIn();
        if (loggedIn) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
