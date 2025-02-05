import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  user: any = {};
  message: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getUserInfo().subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (err) => {
        console.error("❌ Erreur récupération utilisateur :", err);
        this.message = "Erreur lors du chargement des informations.";
      }
    });
  }

  // ✅ Ajout de la méthode pour modifier les infos utilisateur
  onSubmit(updateForm: any) {
    if (!updateForm.valid) {
      this.message = "Tous les champs doivent être remplis.";
      return;
    }

    this.apiService.updateUser(this.user).subscribe({
      next: () => {
        this.message = "Informations mises à jour avec succès !";
      },
      error: (err) => {
        console.error("❌ Erreur mise à jour :", err);
        this.message = "Erreur lors de la mise à jour.";
      }
    });
  }

  logout() {
    this.apiService.logoutUser().subscribe({
      next: (response) => {
        console.log("✅ Déconnexion réussie :", response);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken'); // 🔥 Supprime aussi le refreshToken
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("❌ Erreur lors de la déconnexion :", error);
      }
    });
  }


  deleteAccount() {
    this.apiService.deleteUser().subscribe(() => {
      localStorage.removeItem('authToken');
      this.router.navigate(['/']);
    });
  }

  // ✅ Ajout des méthodes pour la navigation
  modifyPassword() {
    this.router.navigate(['/modify-password']);
  }

  modifyDetails() {
    this.router.navigate(['/modify-details']);
  }
}
