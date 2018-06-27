import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material/material.module'
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list/list-item/list-item.component';

@NgModule({
    providers: [
    ],
    imports: [
        DemoMaterialModule,
    ],
    declarations: [
        ListComponent,
        ListItemComponent,
    ],
    exports: [
        ListComponent,
        ListItemComponent,
        CommonModule
    ],
  })
  export class ComponentsModule {}
  