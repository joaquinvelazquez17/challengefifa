import { inject, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PlayerService } from './player';

describe('PlayerService (standalone)', () => {
  const mockResponse = {
    data: [
      {
        id: 1,
        name: 'Lionel Messi',
        club: 'FC Barcelona',
        position: 'CF',
        nationality: 'Argentina',
        rating: 94,
        speed: 94,
        shooting: 91,
        dribbling: 97,
        passing: 89,
        faceUrl: 'https://cdn.sofifa.net/players/158/023/15_120.png'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        provideHttpClientTesting()
      ]
    });
  });

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch players', inject(
    [PlayerService, HttpTestingController],
    (service: PlayerService, httpMock: HttpTestingController) => {
      service.getPlayers().subscribe(players => {
        expect(players.length).toBe(1);
        expect(players[0].name).toBe('Lionel Messi');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/players');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
      httpMock.verify();
    }
  ));

  it('should fetch a player by ID', inject(
    [PlayerService, HttpTestingController],
    (service: PlayerService, httpMock: HttpTestingController) => {
      service.getPlayer(1).subscribe(player => {
        expect(player?.name).toBe('Lionel Messi');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/players');
      req.flush(mockResponse);
      httpMock.verify();
    }
  ));
});
