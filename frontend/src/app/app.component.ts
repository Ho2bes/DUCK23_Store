import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ajout pour gérer router-outlet
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Ajout de RouterModule pour router-outlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'duck23-store';
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe(
      (response: any) => {
        this.data = response;
        console.log('Données récupérées :', response);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
