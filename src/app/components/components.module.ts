import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material/material.module'
import { ListComponent } from './list/list.component';

@NgModule({
    providers: [
    ],
    imports: [
        DemoMaterialModule,
        CommonModule
    ],
    declarations: [
        ListComponent,
    ],
    exports: [
        ListComponent,
        CommonModule
    ],
})
export class ComponentsModule { }
