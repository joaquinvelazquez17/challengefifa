import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Player } from '../../services/player/player';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { BehaviorSubject } from 'rxjs';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  providers: [PlayerService],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class PlayerComponent implements OnInit {
  playerSubject = new BehaviorSubject<Player | null>(null);
  errorMessage = '';
  chart?: Chart;

  @ViewChild('skillsRadarChart', { static: false }) skillsRadarChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'ID inválido en la URL';
      return;
    }

    try {
      const player = await this.playerService.getPlayer(id);
      this.playerSubject.next(player);

      // Pequeña espera para que Angular renderice el canvas
      setTimeout(() => this.createRadarChart(), 0);
    } catch (error) {
      console.error('Error obteniendo jugador:', error);
      this.errorMessage = 'Jugador no encontrado';
    }
  }

  createRadarChart() {
    const player = this.playerSubject.value;
    const canvas = this.skillsRadarChart?.nativeElement;
    if (!canvas || !player) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Speed', 'Shooting', 'Defending', 'Dribbling', 'Passing', 'Physic'],
        datasets: [{
          // label: player.name, 
          data: [
            player.speed ?? 0,
            player.shooting ?? 0,
            player.defending ?? 0,
            player.dribbling ?? 0,
            player.passing ?? 0,
            player.physic ?? 0
          ],
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          borderColor: 'rgba(255, 215, 0, 1)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(255, 215, 0, 1)',
          pointBorderColor: '#1a1a1a',
          pointHoverBackgroundColor: '#1a1a1a',
          pointHoverBorderColor: 'rgba(255, 215, 0, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,

        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              display: false  // Oculta los valores numéricos (0, 20, 40, ...)
            },
            grid: {
              display: false  // Oculta las líneas de la cuadrícula (las líneas radiales y circulares)
            },
            pointLabels: {
              display: true  // Deja visibles las etiquetas como "Speed", "Shooting", etc.
            }
          }
        }
      }
    });
  }
  goToEdit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate(['/players', id, 'edit']);
    }
  }
}
