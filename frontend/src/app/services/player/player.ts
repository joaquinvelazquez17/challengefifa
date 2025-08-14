import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
  defending: number;
  physic: number;
  faceUrl: string;
}

export interface PlayerRequest {
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
  faceUrl: string;
  potential: number;
  defending: number;
  physic: number;
  age: number;
}

export interface PlayerResponse {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
  defending: number;
  physic: number;
  faceUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) { }

  getPlayer(id: number): Promise<Player> {
    return firstValueFrom(
      this.http.get<Player>(`${this.baseUrl}/${id}`, {
        withCredentials: true,
      })
    );
  }

  getPlayers(
    page = 1,
    limit = 48,
    name = '',
    club = '',
    position = ''
  ): Observable<Player[]> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (name) params.set('name', name);
    if (club) params.set('club', club);
    if (position) params.set('position', position);

    const url = `${this.baseUrl}?${params.toString()}`;

    return this.http
      .get<{ data: Player[] }>(url, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(map((response) => response.data));
  }

  createPlayer(player: PlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(this.baseUrl, player, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  updatePlayer(
    id: number,
    playerData: Partial<PlayerRequest>
  ): Observable<PlayerResponse> {
    return this.http.patch<PlayerResponse>(
      `${this.baseUrl}/${id}`,
      playerData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
