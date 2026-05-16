import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebShellModule } from '@angular-spotify/web/shell/feature';
import { getAppConfigProvider } from '@angular-spotify/web/shared/app-config';
import {
  authInterceptorProvider,
  unauthorizedInterceptorProvider
} from '@angular-spotify/web/auth/util';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    WebShellModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }), // <-- Nhớ có dấu phẩy ở đây
    DragDropModule // <-- Nó phải đứng riêng rẽ như thế này
  ],
  
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    getAppConfigProvider(environment),
    authInterceptorProvider,
    unauthorizedInterceptorProvider
  ],
})
export class AppModule {}
