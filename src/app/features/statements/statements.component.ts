import { Component, OnInit } from '@angular/core';
import {StatementsService} from './services/statements.service';
import {MatTableDataSource} from '@angular/material';
import { StatementRecord } from './statements.models';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  public displayedColumns;
  public dataSource: any[];
  public numberOfValidItems = 0;
  public numberOfInvalidItems = 0;

  constructor(public statmentsService: StatementsService) { }

  ngOnInit() {
    this.displayedColumns = this.statmentsService.columns;
    this.statmentsService.statements.subscribe( data =>{
      const dataArr = data.toArray();

      this.dataSource = dataArr;
      this.numberOfValidItems = dataArr.filter(item => item.isValid).length;
      this.numberOfInvalidItems = dataArr.filter(item => !item.isValid).length;
    });
  }
}