import { NgModule } from '@angular/core';
import { AnchorComponent } from './anchor/anchor';
import { CommonModule } from '@angular/common';
@NgModule({
	declarations: [AnchorComponent],
	imports: [CommonModule],
	exports: [AnchorComponent]
})
export class ComponentsModule {}
