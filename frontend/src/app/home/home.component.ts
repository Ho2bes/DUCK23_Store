import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// on crée un composant Angular pour la page d'accueil de l'application, qui peut inclure des liens vers les différentes sections de l'application, comme le panier, le compte utilisateur, etc.
// Ce composant est simple et sert de point d'entrée pour l'application, permettant aux utilisateurs de naviguer vers d'autres parties de l'application.
// Il utilise le module RouterModule pour la navigation entre les différentes routes de l'application.

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
