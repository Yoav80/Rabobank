
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { List } from 'immutable';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { PapaParseService } from 'ngx-papaparse';
import { asObservable } from "../../../../helpers/asObservable";
import { roundToTwo } from "../../../../helpers/roundToTwo";
import { StatementRecord } from '../statements.models';

const XML_RECORDS_URL = "../assets/mockData/xml/records.xml";
const CSV_RECORDS_URL = "../assets/mockData/csv/records.csv";

@Injectable()
export class StatementsBackendService {

private _xmlStatements: BehaviorSubject<List<StatementRecord>> = new BehaviorSubject(List([]));

  constructor(private http: HttpClient, 
              private ngxXml2jsonService: NgxXml2jsonService,
              private papa: PapaParseService) {
  }


  public getXMLStatements() {
    return this.fetchData(XML_RECORDS_URL)
        .then(response => {
            return this.parseStatementsXml(response);
        })
  }

  public getCSVStatements() {
    return this.fetchData(CSV_RECORDS_URL)
        .then(response => {
            return this.parseStatementsCSV(response);
        })
  }

  private parseStatementsCSV(csv): StatementRecord[] {
    // Parse the CSV response with PapaParse library
    const parsedCSV = this.papa.parse(csv);
    const data = parsedCSV.data;
   
    if (!data) {
        throwError('failed to parse CSV statements - no data');
    } 
    
    let statementsCSV: StatementRecord[] = [];
    // Get the csv table headers from first item
    const fields = data[0];

    // Loop through the rest
    for (let i = 1; i < data.length; i++) {
        const statement = {};
        const rawData = data[i];

        // Go over the fields according to the headers
        for (let m = 0; m < fields.length; m++ ) {
            // Parse the header to camelCase
            let fieldName = fields[m].replace(' ','');
            fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
            statement[fieldName] = rawData[m];
        }

        statementsCSV.push(<StatementRecord>this.mapObjectToStatement(statement))
    }

    return statementsCSV.filter((record: StatementRecord) => record.reference);
  }

  private parseStatementsXml(xmlString): StatementRecord[] {
    // Parse XML using ngxXml2jsonService
    const obj: any = this.parseXml(xmlString);
    //get the records 
    const rawStatements = obj.records.record;
   
    if (!rawStatements) {
        throwError('failed to parse xml statements - no data');
    }

    //Map over the data 
    return rawStatements
        .map( record => {
            const reference = record['@attributes'] ? record['@attributes'].reference : '';
            const { accountNumber, description, startBalance, mutation, endBalance } = record;  
            return this.mapObjectToStatement({ reference, accountNumber, description, startBalance, mutation, endBalance });
        })
        .filter((record: StatementRecord) => record.reference)
  }

  private parseXml(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'text/xml');
    return this.ngxXml2jsonService.xmlToJson(xml);
  }

  private mapObjectToStatement(obj): StatementRecord {
    return  <StatementRecord>{
        reference: roundToTwo(obj.reference),
        accountNumber: obj.accountNumber,
        description: obj.description,
        startBalance: roundToTwo(obj.startBalance),
        mutation: roundToTwo(obj.mutation),
        endBalance: roundToTwo(obj.endBalance)
      }
  }

  private fetchData(url) {
    return this.http.get(url, {responseType: 'text'})
        .toPromise();
  }
}
