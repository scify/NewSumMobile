import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AnchorComponent } from './anchor/anchor';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list';
@NgModule({
	declarations: [AnchorComponent,
    ArticlesListComponent],
	imports: [CommonModule, IonicModule],
	exports: [AnchorComponent,
    ArticlesListComponent]
})
export class ComponentsModule {}
