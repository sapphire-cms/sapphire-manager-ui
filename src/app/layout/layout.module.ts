import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [
        NavbarComponent,
    ],
    exports: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class LayoutModule { }
