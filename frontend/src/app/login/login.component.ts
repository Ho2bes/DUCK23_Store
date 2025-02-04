import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  username: string = ''; // 🔥 CHANGÉ : `username` au lieu de `email`
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = {
      username: this.username.trim(), // 🔥 On envoie `username`, pas `email`
      password: this.password
    };

    console.log("📤 Tentative de connexion :", payload);

    this.apiService.loginUser(payload).subscribe({
      next: (response) => {
        console.log("✅ Connexion réussie :", response);
        localStorage.setItem('authToken', response.access); // Stocker le token JWT
        this.router.navigate(['/account']);
      },
      error: (error) => {
        console.error("❌ Erreur de connexion :", error);
        this.errorMessage = "Identifiants incorrects.";
      }
    });
  }
}
