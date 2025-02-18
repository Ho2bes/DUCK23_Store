import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = { username: this.username.trim(), password: this.password };

    console.log("📤 Tentative de connexion :", payload);
    this.isLoading = true;  // ✅ Indicateur de chargement
    this.errorMessage = ''; // ✅ Réinitialisation des messages d'erreur
    this.successMessage = '';

    this.authService.loginUser(payload).subscribe({
      next: () => {
        console.log("✅ Connexion réussie !");
        this.successMessage = "🎉 Connexion réussie, redirection...";
        setTimeout(() => {
          this.router.navigate(['/account']); // ✅ Redirection après succès
        }, 1500);
      },
      error: (error) => {
        console.error("❌ Erreur de connexion :", error);
        this.errorMessage = "Identifiants incorrects ou problème de connexion.";
      },
      complete: () => {
        this.isLoading = false; // ✅ Fin du chargement
      }
    });
  }
}
