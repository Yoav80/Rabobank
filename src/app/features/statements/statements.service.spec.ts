import { TestBed, inject } from '@angular/core/testing';

import { StatementsService } from './statements.service';

describe('StatementsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatementsService]
    });
  });

  it('should be created', inject([StatementsService], (service: StatementsService) => {
    expect(service).toBeTruthy();
  }));
});
