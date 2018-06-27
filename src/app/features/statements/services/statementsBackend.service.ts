
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';


import {List} from 'immutable';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { PapaParseService } from 'ngx-papaparse';
import {asObservable} from "../../../../helpers/asObservable";
import { StatementRecord } from '../statements.service';

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
    return this.http.get(XML_RECORDS_URL, {responseType: 'text'})
        .toPromise()
        .then(response => {
            return this.parseStatementsXml(response);
        })
  }

  public getCSVStatements() {
    return this.http.get(CSV_RECORDS_URL, {responseType: 'text'})
        .toPromise()
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
    // Get the csv table headers
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
        const statement = {};
        const rawData = data[i];

        // Go over the rest of the data according to the headers
        for (let m = 0; m < headers.length; m++ ) {
            // Parse the header to camelCase
            let header = headers[m].replace(' ','');
            header = header.charAt(0).toLowerCase() + header.slice(1);
            statement[header] = rawData[m];
        }

        statementsCSV.push(<StatementRecord>statement)
    }

    return statementsCSV;
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
    return rawStatements.map( record => {
      const reference = record['@attributes'] ? record['@attributes'].reference : '';

      return  <StatementRecord>{
        reference,
        accountNumber: record.accountNumber,
        description: record.description,
        startBalance: record.startBalance,
        mutation: record.mutation,
        endBalance: record.endBalance
      }
    })
  }

  private parseXml(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'text/xml');
    return this.ngxXml2jsonService.xmlToJson(xml);
  }
}
