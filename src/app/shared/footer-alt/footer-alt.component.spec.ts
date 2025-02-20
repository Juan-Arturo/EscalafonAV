import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterALTComponent } from './footer-alt.component';

describe('FooterALTComponent', () => {
  let component: FooterALTComponent;
  let fixture: ComponentFixture<FooterALTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterALTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterALTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
