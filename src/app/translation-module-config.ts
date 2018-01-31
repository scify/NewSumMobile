import {TranslateLoader} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

function createTranslationLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const translationServiceConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslationLoader),
    deps: [HttpClient]
  }
};

