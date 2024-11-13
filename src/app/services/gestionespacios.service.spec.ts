import { TestBed } from '@angular/core/testing';

import { GestionespaciosService } from './gestionespacios.service';

describe('GestionespaciosService', () => {
  let service: GestionespaciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionespaciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
