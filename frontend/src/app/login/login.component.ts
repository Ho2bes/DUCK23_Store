import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

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

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = { username: this.username.trim(), password: this.password };

    console.log("📤 Tentative de connexion :", payload);

    this.apiService.loginUser(payload).subscribe({
      next: (response) => {
        console.log("✅ Connexion réussie :", response);

        // 🔥 Stocker les tokens dans localStorage pour rester connecté
        if (response.access && response.refresh) {
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
          console.log("🔐 Token stocké :", response.access);
          this.router.navigate(['/account']);
        } else {
          console.error("❌ Erreur : Token JWT non reçu !");
          this.errorMessage = "Erreur serveur, essayez plus tard.";
        }
      },
      error: (error) => {
        console.error("❌ Erreur de connexion :", error);
        this.errorMessage = "Identifiants incorrects ou problème de connexion.";
      }
    });
  }
}
