import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // 🔴 Remis en place pour correspondre au HTML

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    console.log("📤 Données envoyées :", payload); // Vérification des données envoyées

    this.apiService.registerUser(payload).subscribe({
      next: () => {
        this.errorMessage = "✅ Inscription réussie ! Redirection...";
        setTimeout(() => {
          this.router.navigate(['/login']); // ✅ Redirection après 1.5 sec
        }, 1500);
      },
      error: (error) => {
        console.error("❌ Erreur d'inscription :", error);
        this.errorMessage = error.error?.message || "Une erreur est survenue lors de l'inscription.";
      }
    });
  }
}
