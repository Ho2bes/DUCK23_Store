// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Composant pour la page de connexion
// Ce composant gère la connexion des utilisateurs, y compris la validation des champs, l'envoi des données de connexion et la gestion des messages d'erreur ou de succès.
// Il utilise le service AuthService pour interagir avec l'API de connexion et Router pour la navigation après une connexion réussie.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Récupérer l'URL de retour des paramètres de la requête
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
  }

// Gérer la soumission du formulaire de connexion et la validation des champs
  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = { username: this.username.trim(), password: this.password }; // on prépare les données de connexion à envoyer au service

    console.log("📤 Tentative de connexion :", payload);
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.loginUser(payload).subscribe({
      next: () => {
        console.log("✅ Connexion réussie !");
        this.successMessage = "🎉 Connexion réussie, redirection...";
        setTimeout(() => {
          // Rediriger vers l'URL de retour après connexion réussie
          this.router.navigateByUrl(this.returnUrl);
        }, 1500);
      },
      error: (error) => {
        console.error("❌ Erreur de connexion :", error);
        this.errorMessage = "Identifiants incorrects ou problème de connexion.";
        this.isLoading = false;
      }
    });
  }
}
