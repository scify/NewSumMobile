import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AnchorComponent } from './anchor/anchor';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list';
import {NetworkProvider} from "../providers/network/network";

@NgModule({
	declarations: [AnchorComponent,
    ArticlesListComponent],
	imports: [CommonModule, IonicModule],
	exports: [AnchorComponent,
    ArticlesListComponent],
	providers: [NetworkProvider]
})

export class ComponentsModule {}
