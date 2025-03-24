import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'duck23-store';
  isAuthenticated: boolean = false;  // ✅ Variable pour suivre l'état de connexion
  userData: any;  // ✅ Stocke les infos utilisateur

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // ✅ Vérifie si l'utilisateur est connecté et récupère les infos utilisateur
    this.authService.isLoggedIn().subscribe({
      next: (loggedIn) => {
        this.isAuthenticated = loggedIn;
        // ✅ Récupère les infos utilisateur
        if (loggedIn) {
          console.log('✅ Utilisateur connecté.');
        } else {
          console.warn('🔴 Utilisateur non connecté.');
        }
      },
      error: (error) => console.error('❌ Erreur vérification connexion:', error)
    });
  }
}
