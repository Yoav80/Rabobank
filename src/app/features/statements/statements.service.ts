
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, BehaviorSubject } from 'rxjs';
import {List} from 'immutable';
import { NgxXml2jsonService } from 'ngx-xml2json';
import {asObservable} from "../../../helpers/asObservable";
import { StatementsBackendService } from './services/statementsBackend.service';

const XML_RECORDS_URL = "../assets/mockData/xml/records.xml";
const CSV_RECORDS_URL = "../assets/mockData/csv/records.csv";

@Injectable()
export class StatementsService {

  private _statements: BehaviorSubject<List<StatementRecord>> = new BehaviorSubject(List([]));

  constructor(private http: HttpClient,
              private backend: StatementsBackendService, 
              private ngxXml2jsonService: NgxXml2jsonService) {
    this.loadInitialData();
  }

  get statements() {
    return asObservable(this._statements);
  }

  private loadInitialData() {
    this.backend.getXMLStatements()
      .then(statements => {
        console.log('Recieved XML statments: ', statements);
        this.handleNewStatements(statements);
      })
      .catch(err => {
        console.error('Error loading xml statements', err);
      })

    this.backend.getCSVStatements()
      .then(statements => {
        console.log('Recieved CSV statments: ', statements);
        this.handleNewStatements(statements);
      })
      .catch(err => {
        console.error('Error loading CSV statements', err);
      })
  }

  private handleNewStatements(statements) {
    //this.validateStatements(statements);
    this.addStatements(statements);
  }

  private addStatements(statements) {
    const oldStatements = this._statements.getValue().toArray();
    this._statements.next(List([...statements, ...oldStatements]));    
  }
}

export interface StatementRecord {
  reference: number,
  accountNumber: string,
  description: string,
  startBalance: number,
  mutation: number,
  endBalance: number,
  isValid: boolean
}