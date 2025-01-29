import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Utilisation avancée
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [provideHttpClient()], // Déplace `provideHttpClient` ici
  bootstrap: [AppComponent],
})
export class AppModule {}
