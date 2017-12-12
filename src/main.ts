import '../lib/polyfills';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoModule} from "./app/Demo/DemoModule";

platformBrowserDynamic().bootstrapModule(DemoModule)
    .catch(err => console.log(err));
