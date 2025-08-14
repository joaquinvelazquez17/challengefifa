import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService, PlayerResponse } from '../../services/player/player';

@Component({
  selector: 'app-created-player',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [PlayerService],
  templateUrl: './createPlayer.html',
  styleUrls: ['./createPlayer.css'],
})
export class CreatePlayerComponent implements OnInit {
  playerForm!: FormGroup;
  players: PlayerResponse[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      club: [''],
      position: ['', Validators.required],
      nationality: [''],
      rating: [0, Validators.required],
      speed: [0],
      shooting: [0],
      dribbling: [0],
      passing: [0],
      faceUrl: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSozJWPnJ7PXp-KfN5MVAEdXQ7cnSnf6B-wM5nwI0s7O13PQzduhvM6EM8lysOaBYmRZQY&usqp=CAU', Validators.required],
      potential: [0, Validators.required],
      age: [0, Validators.required],
      defending: [0, Validators.required],
      physic: [0, Validators.required],
    });
  }

  onSubmit() {
    if (this.playerForm.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
      return;
    }

    this.playerService.createPlayer(this.playerForm.value).subscribe({
      next: (player: PlayerResponse) => {
        this.players.unshift(player);
        this.errorMessage = '';
        this.successMessage = `Jugador creado exitosamente. ID: ${player.id}`;
        this.playerForm.reset();
      },
      error: () => {
        this.errorMessage = 'No se pudo crear el jugador';
      }
    });
  }
}
