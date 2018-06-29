
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { asObservable } from "../../../../helpers/asObservable";
import { StatementsBackendService } from './statementsBackend.service';
import { roundToTwo } from "../../../../helpers/roundToTwo";
import { StatementRecord, StatementErrorCode } from "../statements.models";

@Injectable()
export class StatementsService {

  private _statements: BehaviorSubject<List<StatementRecord>> = new BehaviorSubject(List([]));
  private statementsMap: { [reference: string]: string; } = {};

  constructor(private backend: StatementsBackendService) {
    this.loadInitialData();
  }

  /**
   * Getter for all statements - returns an observable
   */
  public get statements(): Observable<any> {
    return asObservable(this._statements);
  }

  public get columns() {
    return [
      { field: 'reference', display: 'Reference' }, 
      { field: 'status', display: 'Status' },
      { field: 'accountNumber', display: 'Account' }, 
      { field: 'description', display: 'Description' }, 
      { field: 'startBalance', display: 'Start Balance' },
      { field: 'endBalance', display: 'End Balance' }, 
      { field: 'mutation', display: 'Mutation' }
    ];
  }

  /**
   * Load all statements (xml & csv)
   */
  private loadInitialData() {
    this.loadCsvStatements();
    this.loadXMLStatements();
  }

  private async loadCsvStatements() {
    try {
      const statements = await this.backend.getCSVStatements();
      this.handleNewStatements(statements);
    }
    catch (err) {
      console.error('Error loading CSV statements', err);
    }
  }

  private async loadXMLStatements() {
    try {
      const statements = await this.backend.getXMLStatements();
      this.handleNewStatements(statements);
    }
    catch (err) {
      console.error('Error loading xml statements', err);
    }
  }

  /**
   * Handles new statements
   * @param statements 
   */
  private handleNewStatements(statements: StatementRecord[]) {
    const _statements: StatementRecord[] = statements.map(record => {
      return this.checkStatementValidity(record);
    });

    _statements.length && this.addStatements(_statements);
  }

  /**
   * Checks the statement validity
   * @param statement 
   */
  private checkStatementValidity(statement: StatementRecord): StatementRecord {
    // Check if reference already exists
    if (this.statementsMap[statement.reference]) {
      return this.updateStatementStatus(statement, StatementErrorCode.notUnique);
    }

    // Check the transaction balance
    if (!this.isBalanceValid(statement)) {
      return this.updateStatementStatus(statement, StatementErrorCode.unbalanced);
    }

    // Save reference
    this.statementsMap[statement.reference] = statement.accountNumber;
    return this.updateStatementStatus(statement, StatementErrorCode.noError);
  }

  /**
   * Updates the statement status according to the error code
   * @param statement 
   * @param errorCode 
   */
  private updateStatementStatus(statement: StatementRecord, errorCode: StatementErrorCode): StatementRecord {
    statement.isValid = errorCode === StatementErrorCode.noError,
      statement.errorCode = errorCode;
    statement.status = this.translateErrorCode(errorCode);
    return statement;
  }

  /**
   * Checks the statement's balance
   * @param statement 
   */
  private isBalanceValid(statement: StatementRecord) {
    const { mutation, startBalance, endBalance } = statement;
    return roundToTwo(startBalance + mutation) === endBalance;
  }

  /**
   * Translates the validity error code to string
   * @param error 
   */
  private translateErrorCode(error: StatementErrorCode): string {
    switch (error) {
      case StatementErrorCode.noError:
        return 'Valid ';
      case StatementErrorCode.notUnique:
        return 'Not Unique ';
      case StatementErrorCode.unbalanced:
        return 'Unblanaced ';
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