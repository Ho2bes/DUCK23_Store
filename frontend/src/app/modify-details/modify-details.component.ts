import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-modify-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modify-details.component.html',
  styleUrls: ['./modify-details.component.scss']
})
export class ModifyDetailsComponent {
  user: any = {};
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
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

  onSubmit(form: any) {
    if (!form.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    this.apiService.updateUser(this.user).subscribe({
      next: () => {
        console.log("✅ Détails mis à jour !");
        this.router.navigate(['/account']);
      },
      error: (error: any) => {
        console.error("❌ Erreur lors de la mise à jour :", error);
        this.errorMessage = "Impossible de mettre à jour les informations.";
      }
    });
  }
}
