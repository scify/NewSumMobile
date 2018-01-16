import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";

@Injectable()
export class AppStorageProvider {

    constructor(public storage: Storage) {
    }

    set(dataKey, data): Promise<any> {
        return this.storage.set(dataKey, data.toString());
    }

    get(dataKey): Promise<any> {
        return this.storage.get(dataKey);
    }

}
