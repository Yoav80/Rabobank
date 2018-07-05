import { Component, OnInit } from '@angular/core';
import { StatementsService } from './services/statements.service';
import { MatTableDataSource } from '@angular/material';
import { StatementRecord, FileType } from './statements.models';

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

  private fileTypes = ['xml', 'csv'];  // Acceptable file types

  constructor(public statmentsService: StatementsService) { }

  ngOnInit() {
    this.displayedColumns = this.statmentsService.columns;
    this.statmentsService.statements.subscribe(data => {
      const dataArr = data.toArray();

      this.dataSource = dataArr;
      this.numberOfValidItems = dataArr.filter(item => item.isValid).length;
      this.numberOfInvalidItems = dataArr.filter(item => !item.isValid).length;
    });
  }

  openFile(e) {
    const input: any = event.target;
    const files = input.files;
    const reader = new FileReader();

    if (files && files[0]) {
      const extension = this.statmentsService.getExtension(files[0].name);
      if (this.fileTypes.indexOf(extension) === -1) {
        alert('File type is not supported');
      }

      reader.onload = () => {
        const text = reader.result;
        this.statmentsService.loadFileStatements(extension, text);
      };

      reader.readAsText(files[0]);
    }
  }


}
