import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CreatePlayerComponent } from './createPlayer';
import { PlayerService, PlayerResponse } from '../../services/player/player';
import { CommonModule } from '@angular/common';

describe('CreatedPlayerComponent', () => {
  let component: CreatePlayerComponent;
  let fixture: ComponentFixture<CreatePlayerComponent>;
  let playerServiceSpy: jasmine.SpyObj<PlayerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PlayerService', ['createPlayer']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, CreatePlayerComponent],
      providers: [{ provide: PlayerService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerComponent);
    component = fixture.componentInstance;
    playerServiceSpy = TestBed.inject(PlayerService) as jasmine.SpyObj<PlayerService>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido si faltan campos requeridos', () => {
    component.playerForm.patchValue({ name: '', position: '', faceUrl: '' });
    expect(component.playerForm.invalid).toBeTrue();
  });

  it('debería llamar a createPlayer y agregar un jugador en éxito', () => {
    const requestData = {
      name: 'NerdFlanderss',
      club: 'FC ChatGPT',
      position: 'Midfielder',
      nationality: 'Argentina',
      rating: 85,
      speed: 90,
      shooting: 75,
      dribbling: 88,
      passing: 92,
      faceUrl: 'https://example.com/face.png',
      potential: 99,
      age: 31,
      defending: 80,
      physic: 85
    };

    const mockResponse: PlayerResponse = {
      id: 161600,
      name: 'NerdFlanderss',
      club: 'FC ChatGPT',
      position: 'Midfielder',
      nationality: 'Argentina',
      rating: 85,
      speed: 90,
      shooting: 75,
      dribbling: 88,
      passing: 92,
      defending: 0,
      physic: 0,
      faceUrl: 'https://example.com/face.png'
    };

    // Seteamos el formulario con todos los valores requeridos
    component.playerForm.setValue(requestData);

    playerServiceSpy.createPlayer.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(playerServiceSpy.createPlayer).toHaveBeenCalledWith(requestData);
    expect(component.players.length).toBe(1);
    expect(component.successMessage).toContain('Jugador creado exitosamente');
  });

  it('debería mostrar mensaje de error si falla la creación', () => {
    component.playerForm.patchValue({
      name: 'Fail Player',
      club: 'Club Fail',
      position: 'Midfielder',
      nationality: 'Nowhere',
      rating: 80,
      speed: 70,
      shooting: 65,
      dribbling: 72,
      passing: 75,
      faceUrl: 'http://fail.com',
      potential: 85,
      age: 25,
      defending: 70,
      physic: 75
    });

    playerServiceSpy.createPlayer.and.returnValue(throwError(() => new Error('Error en API')));

    component.onSubmit();

    expect(playerServiceSpy.createPlayer).toHaveBeenCalled();
    expect(component.errorMessage).toBe('No se pudo crear el jugador');
  });
});
