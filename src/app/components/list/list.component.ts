import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {  
  @Input() columnsDef: any[];
  @Input() dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: any[];
  constructor() { }

  ngOnInit() {
    // Hack for sorting - anti pattern
    this.dataSource.sort = this.sort;
    this.displayedColumns = this.columnsDef.map(col => col.field);
  }

  getHeaderLabel(col) {
    const def = this.columnsDef.find(column => {
      return column.field === col
    });

    return def.display;
  }

}
