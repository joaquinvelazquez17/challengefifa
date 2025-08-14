import { Routes } from '@angular/router';
import { PlayersComponent } from './components/players/players';
import { PlayerComponent } from './components/player/player';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';
import { CreatePlayerComponent } from './components/createPlayer/createPlayer';
import { UpdatePlayerComponent } from './components/updatePlayer/updatePlayer';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: 'players',
        component: PlayersComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'players/:id',
        component: PlayerComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'players/:id/edit',
        component: UpdatePlayerComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'create-player',
        component: CreatePlayerComponent,
        canActivate: [AuthGuard],
    },

    { path: '', redirectTo: '/players', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
