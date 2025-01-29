import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'duck23-store';
  data: any; // Propriété pour stocker les données récupérées

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe(
      (response: any) => { // Type explicite pour 'response'
        this.data = response;
        console.log('Données récupérées :', response);
      },
      (error: any) => { // Type explicite pour 'error'
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
