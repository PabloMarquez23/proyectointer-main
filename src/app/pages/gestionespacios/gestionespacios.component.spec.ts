import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionespaciosComponent } from './gestionespacios.component';

describe('GestionespaciosComponent', () => {
  let component: GestionespaciosComponent;
  let fixture: ComponentFixture<GestionespaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionespaciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionespaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
