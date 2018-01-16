import { Component } from '@angular/core';

import { AllTopicsPage } from '../all-topics/all-topics';
import { HotTopicsPage } from '../hot-topics/hot-topics';

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
  tab1Root = HotTopicsPage;
  tab2Root = AllTopicsPage;
}
