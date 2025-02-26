import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtDocumentoComponent } from './ct-documento.component';

describe('CtDocumentoComponent', () => {
  let component: CtDocumentoComponent;
  let fixture: ComponentFixture<CtDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
