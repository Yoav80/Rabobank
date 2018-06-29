import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { PapaParseService } from 'ngx-papaparse';
import { StatementsBackendService } from './statementsBackend.service';

describe('StatementsBackendService', () => {
    let statementsBackendService: StatementsBackendService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                PapaParseService,
                StatementsBackendService
            ]
        });

        statementsBackendService = TestBed.get(StatementsBackendService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should be created', inject([StatementsBackendService], (service: StatementsBackendService) => {
        expect(service).toBeTruthy();
    }));

    it('should parse csv', inject([StatementsBackendService], (service: StatementsBackendService) => {
        const parser = service['parseStatementsCSV'].bind(service);
        const csv = parser(csvMock);
        expect(csv).toEqual([csvMockJson]);
    }));

    it('should parse xml', inject([StatementsBackendService], (service: StatementsBackendService) => {
        const parser = service['parseStatementsXml'].bind(service);
        const xml = parser(xmlMock);
        expect(xml).toEqual([csvMockJson]);
    }));
});

const csvMock = `Reference,Account Number,Description,Start Balance,Mutation,End Balance
1,a1,des,1,-2,-1`;
const csvMockJson = {
    reference: 1,
    accountNumber: 'a1',
    description: 'des',
    startBalance: 1,
    mutation: -2,
    endBalance: -1
}

const xmlMock = `<records>
<record reference="1">
  <accountNumber>a1</accountNumber>
  <description>des</description>
  <startBalance>1</startBalance>
  <mutation>-2</mutation>
  <endBalance>-1</endBalance>
</record>
</records>`;