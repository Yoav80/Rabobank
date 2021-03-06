
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { List } from 'immutable';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { PapaParseService } from 'ngx-papaparse';
import { asObservable } from '../../../../helpers/asObservable';
import { roundToTwo } from '../../../../helpers/roundToTwo';
import { camelize } from '../../../../helpers/camelize';
import { StatementRecord } from '../statements.models';

const XML_RECORDS_URL = '../assets/mockData/xml/records.xml';
const CSV_RECORDS_URL = '../assets/mockData/csv/records.csv';

@Injectable()
export class StatementsBackendService {

    private _xmlStatements: BehaviorSubject<List<StatementRecord>> = new BehaviorSubject(List([]));
    private ngxXml2jsonService: NgxXml2jsonService = new NgxXml2jsonService();

    constructor(private http: HttpClient,
        private papa: PapaParseService) {
    }


    public getXMLStatements(): Promise<StatementRecord[]> {
        return this.fetchData(XML_RECORDS_URL)
            .then(response => {
                return this.parseStatementsXml(response);
            });
    }

    public getCSVStatements(): Promise<StatementRecord[]> {
        return this.fetchData(CSV_RECORDS_URL)
            .then(response => {
                return this.parseStatementsCSV(response);
            });
    }

    public parseStatementsCSV(csv): StatementRecord[] {
        // Parse the CSV response with PapaParse library
        const parsedCSV = this.papa.parse(csv);
        const data = parsedCSV.data;

        if (!data) {
            throwError('failed to parse CSV statements - no data');
        }

        // Get the csv table headers from first item
        const fieldNames = data.shift().map(camelize);

        // Create records according to fieldNames
        return data.map(this.createStatementRecordFromCsv(fieldNames)).filter(this.hasReference);
    }

    public parseStatementsXml(xmlString): StatementRecord[] {
        // Parse XML using ngxXml2jsonService
        const obj: any = this.parseXml(xmlString);
        // Get the records
        const rawStatements = obj.records.record;

        if (!rawStatements) {
            throwError('failed to parse xml statements - no data');
        }

        // The object is not an array - try to create a single record
        if (!Array.isArray(rawStatements)) {
            return [this.createStatementRecordFromXml()(rawStatements)];
        }

        // Map over the data
        return rawStatements
            .map(this.createStatementRecordFromXml())
            .filter((record: StatementRecord) => record.reference);
    }

    private createStatementRecordFromXml() {
        return (record) => {
            const reference = record['@attributes'] ? record['@attributes'].reference : '';
            const { accountNumber, description, startBalance, mutation, endBalance } = record;
            return this.mapObjectToStatement({ reference, accountNumber, description, startBalance, mutation, endBalance });
        };
    }

    private createStatementRecordFromCsv(fieldNames): any {
        return (record) => {
            const statement = fieldNames.reduce((statementRecord, field, index) => {
                statementRecord[field] = record[index];
                return statementRecord;
            }, <StatementRecord>{});

            return this.mapObjectToStatement(statement);
        };
    }

    private mapObjectToStatement(obj): StatementRecord {
        return <StatementRecord>{
            reference: roundToTwo(obj.reference),
            accountNumber: obj.accountNumber,
            description: obj.description,
            startBalance: roundToTwo(obj.startBalance),
            mutation: roundToTwo(obj.mutation),
            endBalance: roundToTwo(obj.endBalance)
        };
    }

    private fetchData(url): Promise<any> {
        return this.http.get(url, { responseType: 'text' })
            .toPromise();
    }

    private parseXml(xmlString) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');
        return this.ngxXml2jsonService.xmlToJson(xml);
    }

    private hasReference(record) {
        return !!record.reference;
    }
}
