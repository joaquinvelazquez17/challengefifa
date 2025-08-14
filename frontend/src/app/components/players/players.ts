import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Player } from '../../services/player/player';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PlayerService],
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  errorMessage = '';
  page = signal(1);
  readonly limit = 12;

  // NUEVOS FILTROS
  filterField = 'name';  // campo por defecto para filtrar
  filterValue = '';      // valor del filtro

  constructor(
    private playerService: PlayerService,
    private router: Router
  ) { }

  goToPlayer(id: number) {
    this.router.navigate(['/players', id]);
  }

  ngOnInit() {
    this.fetchPlayers();
  }

  fetchPlayers() {
    let name = '';
    let club = '';
    let position = '';

    // Asignamos el filtro según el campo seleccionado
    if (this.filterValue.trim()) {
      if (this.filterField === 'name') name = this.filterValue.trim();
      else if (this.filterField === 'club') club = this.filterValue.trim();
      else if (this.filterField === 'position') position = this.filterValue.trim();
    }

    this.playerService.getPlayers(this.page(), this.limit, name, club, position).subscribe({
      next: (data) => {
        this.players = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los jugadores';
        this.players = [];
      },
    });
  }

  nextPage() {
    this.page.update(p => p + 1);
    this.fetchPlayers();
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.fetchPlayers();
    }
  }

  onFilterChange() {
    this.page.set(1);  // resetear paginación al cambiar filtro
    this.fetchPlayers();
  }

  exportToCSV() {
    // Paso 1: Seleccionamos y reordenamos las propiedades que queremos
    const exportData = this.players.map(player => ({
      ID: player.id,
      Nombre: player.name,
      Club: player.club,
      Posición: player.position,
      País: player.nationality,
      Rating: player.rating,
    }));

    // Paso 2: Convertimos a hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Paso 3: Creamos el libro (workbook)
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Jugadores': worksheet },
      SheetNames: ['Jugadores']
    };

    // Paso 4: Lo convertimos a archivo .xlsx
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Paso 5: Guardamos el archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `jugadores_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
}
