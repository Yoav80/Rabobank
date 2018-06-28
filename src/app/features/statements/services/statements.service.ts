
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { NgxXml2jsonService } from 'ngx-xml2json';
import {asObservable} from "../../../../helpers/asObservable";
import { StatementsBackendService } from './statementsBackend.service';
import { roundToTwo } from "../../../../helpers/roundToTwo";
import { StatementRecord } from "../statements.models";
const XML_RECORDS_URL = "../assets/mockData/xml/records.xml";
const CSV_RECORDS_URL = "../assets/mockData/csv/records.csv";

@Injectable()
export class StatementsService {

  private _statements: BehaviorSubject<List<StatementRecord>> = new BehaviorSubject(List([]));
  private statementsMap: { [s: string]: string; } = {};

  constructor(private http: HttpClient,
              private backend: StatementsBackendService, 
              private ngxXml2jsonService: NgxXml2jsonService) {
    this.loadInitialData();
  }

  /**
   * Getter for all statements - returns an observable
   */
  public get statements(): Observable<any> {
    return asObservable(this._statements);
  }

  public get columns() {
    return [{
      field: 'reference',
      display: 'Reference'
    },{
      field: 'isValid',
      display: 'isValid'
    },{
      field: 'accountNumber',
      display: 'Account'
    },{
      field: 'description',
      display: 'Description'
    },{
      field: 'startBalance',
      display: 'Start Balance'
    },{
      field: 'endBalance',
      display: 'End Balance'
    },{
      field: 'mutation',
      display: 'Mutation'
    }];
  }

  /**
   * Load all statements (xml & csv)
   */
  private loadInitialData() {
    this.statementsMap = {};
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

  /**
   * Handles new statements
   * @param statements 
   */
  private handleNewStatements(statements: StatementRecord[]) {
    const _statements: StatementRecord[] = [];

    statements.forEach(element => {
      this.checkStatementValidity(element);
      _statements.push(element);
    });

    _statements.length && this.addStatements(_statements);
  }

  /**
   * Checks the statement validity
   * @param statement 
   */
  private checkStatementValidity(statement: StatementRecord) {
    statement.isValid = true;
    // Check if reference already exists
    if (this.statementsMap[statement.reference]) {
      console.error("found duplicate reference", statement.reference);
      statement.isValid = false;   
      return;   
    }

    // Check the transaction balance
    if (!this.isBalanceValid(statement)) {
      console.error("found unbalanced statement", statement);
      statement.isValid = false;
      return;
    }

    // Save reference
    
    this.statementsMap[statement.reference] = statement.accountNumber;
  }

  /**
   * Checks the statement's balance
   * @param statement 
   */
  private isBalanceValid(statement: StatementRecord) {
    const { mutation, startBalance, endBalance } = statement;
    if (roundToTwo(startBalance + mutation) === endBalance) {
      return true;
    }
  }

  /**
   * Adds new statements to the statements observable
   * @param statements 
   */
  private addStatements(statements) {
    const oldStatements = this._statements.getValue().toArray();
    this._statements.next(List([...statements, ...oldStatements]));    
  }
}