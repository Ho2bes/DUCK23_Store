import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true, // Si vous utilisez des composants autonomes
  imports: [CommonModule], // Importation de CommonModule
  template: `
    <div>
      <h1>{{ title }}</h1> <!-- Utilisation de la propriété title dans le template -->
      <button (click)="testHttpClient()">Test Backend</button>
      <p *ngIf="response">{{ response | json }}</p>
    </div>
  `,
})
export class AppComponent {
  title = 'Test Angular HttpClient'; // Ajout de la propriété title
  response: any;

  constructor(private apiService: ApiService) {}

  testHttpClient(): void {
    this.apiService.getTest().subscribe(
      (data) => {
        console.log('Success:', data);
        this.response = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
