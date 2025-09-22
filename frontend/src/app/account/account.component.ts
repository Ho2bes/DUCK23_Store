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

  // on initialise le composant en récupérant les informations de l'utilisateur via le service ApiService.
  // on gère également la soumission du formulaire de mise à jour, la déconnexion et la suppression du compte.
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

  // on gère la soumission du formulaire de mise à jour des informations utilisateur.
  // on affiche un message de succès ou d'erreur en fonction du résultat de la requête.
  onSubmit(updateForm: any) {
    if (!updateForm.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    // Appel au service pour mettre à jour les informations utilisateur
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

  // on gère la déconnexion de l'utilisateur en appelant le service ApiService.
  // on redirige vers la page de connexion après une déconnexion réussie.
  // on affiche un message d'erreur en cas de problème lors de la déconnexion.
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

  // on gère la suppression du compte utilisateur en appelant le service ApiService.
  // on demande une confirmation avant de procéder à la suppression.
  // on redirige vers la page d'enregistrement après une suppression réussie.
  // on affiche un message d'erreur en cas de problème lors de la suppression.
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
