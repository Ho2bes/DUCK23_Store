import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 🔥 Ajoute cette ligne

// on crée un composant Angular pour la page d'accueil du compte utilisateur, qui peut inclure des liens vers les fonctionnalités du compte, comme la gestion des informations personnelles, la sécurité, etc.
@Component({
  selector: 'app-account-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.scss']
})
export class AccountHomeComponent {}
