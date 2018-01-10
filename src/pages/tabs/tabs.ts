import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { HotTopicsPage } from "../hot-topics/hot-topics";

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
  tab1Root = HotTopicsPage;
  tab2Root = HomePage;
}
