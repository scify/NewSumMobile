import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
  tab1Root = AboutPage; // TODO: change
  tab2Root = HomePage;
}
