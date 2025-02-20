import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAcessComponent } from './quick-acess.component';

describe('QuickAcessComponent', () => {
  let component: QuickAcessComponent;
  let fixture: ComponentFixture<QuickAcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
