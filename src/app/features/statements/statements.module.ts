import { NgModule } from '@angular/core';
import { StatementsService } from './services/statements.service';
import { StatementsBackendService } from './services/statementsBackend.service';
import { StatementsComponent } from './statements.component';
import { DemoMaterialModule } from '../../material/material.module'
import { ComponentsModule } from '../../components/components.module'
import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
    exports: [
        StatementsComponent,
    ],
    providers: [
        StatementsService,
        StatementsBackendService
    ],
    imports: [
        DemoMaterialModule,
        ComponentsModule,
        PapaParseModule,
    ],
    declarations: [
        StatementsComponent,
    ],
})
export class StatementsModule { }
