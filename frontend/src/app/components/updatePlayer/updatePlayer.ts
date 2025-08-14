import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player/player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-player',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [PlayerService],
  templateUrl: './updatePlayer.html',
  styleUrls: ['./updatePlayer.css']
})
export class UpdatePlayerComponent implements OnInit {
  playerForm!: FormGroup;
  playerId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.playerId = +this.route.snapshot.paramMap.get('id')!;
    this.playerForm = this.fb.group({
      name: [''],
      position: [''],
      club: [''],
      nationality: [''],
      rating: [0],
      speed: [0],
      shooting: [0],
      dribbling: [0],
      passing: [0],
      defending: [0],
      physic: [0],
    });

    this.playerService.getPlayer(this.playerId).then(player => {
      this.playerForm.patchValue(player);
    });
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      this.playerService.updatePlayer(this.playerId, this.playerForm.value).subscribe(() => {
        this.router.navigate(['/players', this.playerId]); // ✅ Redirección a /players/:id
      });
    }
  }
}
