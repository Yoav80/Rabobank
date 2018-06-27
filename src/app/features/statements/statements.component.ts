import { Component, OnInit } from '@angular/core';
import {StatementsService} from './statements.service';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  constructor(public statmentsService: StatementsService) { }

  ngOnInit() {
    console.log('StatementsComponent: ', this.statmentsService)
  }

}
