import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() columnsDef: any[];
  @Input() dataSource: any[];
  @ViewChild(MatSort) sort: MatSort;

  public MatTableDataSource = new MatTableDataSource();
  public displayedColumns: any[];

  constructor() { }

  ngOnInit() {
    this.MatTableDataSource.sort = this.sort;
    this.MatTableDataSource.data = this.dataSource;
    this.displayedColumns = this.columnsDef.map(col => col.field);
  }

  ngOnChanges() {
    this.MatTableDataSource.data = this.dataSource;
  }

  getHeaderLabel(col) {
    const def = this.columnsDef.find(column => {
      return column.field === col;
    });

    return def.display;
  }

}
