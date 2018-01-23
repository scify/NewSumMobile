import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the ImageLoadOptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageLoadOptionProvider {
  private selectedImageLoadOption: string;

  constructor(private appStorage: Storage) {
    this.getSelectedImageLoadOptionFromStorage().then((imageLoadOption) => {
      this.selectedImageLoadOption = imageLoadOption || 'all';
      console.error('inside provider', this.selectedImageLoadOption);
    });
  }

  public getSelectedImageLoadOptionFromStorage(): Promise<any> {
    return this.appStorage.get('selected-image-load-option');
  }

  public getSelectedImageLoadOption() {
    return this.selectedImageLoadOption;
  }

  public setSelectedImageLoadOption(newOption: string): Promise<any> {
    this.selectedImageLoadOption = newOption;
    return this.appStorage.set('selected-image-load-option', this.selectedImageLoadOption);
  }
}
