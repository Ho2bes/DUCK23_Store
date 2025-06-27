import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

/*
  Composant pour la page d'inscription
  Ce composant gère l'inscription des nouveaux utilisateurs, y compris la validation des champs, l'envoi des données d'inscription et la gestion des messages d'erreur ou de succès.
  Il utilise le service ApiService pour interagir avec l'API d'inscription et Router pour la navigation après une inscription réussie.
*/
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
  isSubmitting: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    console.log("📤 Données envoyées :", payload);

    this.apiService.registerUser(payload).subscribe({
      next: () => {
        this.errorMessage = "✅ Inscription réussie ! Redirection...";
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error("❌ Erreur d'inscription :", error);
        this.errorMessage = error.error?.message || "Une erreur est survenue lors de l'inscription.";
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
