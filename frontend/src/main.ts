import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { appRouting } from './app/app.routes'; // Import du routing

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, appRouting], // Ajout du routing ici
}).catch(err => console.error(err));
