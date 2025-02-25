import { TestBed } from '@angular/core/testing';

import { PreubaService } from './preuba.service';

describe('PreubaService', () => {
  let service: PreubaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreubaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
