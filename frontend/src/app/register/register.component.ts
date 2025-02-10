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
  errorMessage: string = ''; // ✅ Message d'erreur
  isSubmitting: boolean = false; // ✅ Pour éviter les doubles soumissions

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
        this.isSubmitting = false; // ✅ On réactive le bouton après réponse
      }
    });
  }
}
