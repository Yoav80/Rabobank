import { TestBed, inject } from '@angular/core/testing';

import { StatementsService } from './statements.service';
import { StatementsBackendService } from './statementsBackend.service';

describe('StatementsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatementsService, StatementsBackendService]
    });
  });

  it('should be created', inject([StatementsService], (service: StatementsService) => {
    expect(service).toBeTruthy();
  }));
});
