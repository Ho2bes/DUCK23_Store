import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

// on crée un composant Angular pour gérer le compte utilisateur, y compris la récupération, la mise à jour, la déconnexion et la suppression du compte.';
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
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getUserInfo().subscribe({
      next: (userData: any) => {
        this.user = userData;
      },
      error: (err: any) => {
        console.error("❌ Erreur récupération utilisateur :", err);
        this.errorMessage = "Erreur lors du chargement des informations.";
      }
    });
  }

  onSubmit(updateForm: any) {
    if (!updateForm.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    this.apiService.updateUser(this.user).subscribe({
      next: () => {
        this.message = "✅ Informations mises à jour avec succès !";
      },
      error: (err: any) => {
        console.error("❌ Erreur mise à jour :", err);
        this.errorMessage = "Erreur lors de la mise à jour.";
      }
    });
  }

  logout() {
    this.apiService.logoutUser().subscribe({
      next: () => {
        console.log("✅ Déconnexion réussie !");
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error("❌ Erreur lors de la déconnexion :", error);
      }
    });
  }

  deleteAccount() {
    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      this.apiService.deleteUser().subscribe({
        next: () => {
          console.log("✅ Compte supprimé !");
          this.router.navigate(['/register']);
        },
        error: (error: any) => {
          console.error("❌ Erreur lors de la suppression du compte :", error);
          this.errorMessage = "Impossible de supprimer le compte.";
        }
      });
    }
  }
}
