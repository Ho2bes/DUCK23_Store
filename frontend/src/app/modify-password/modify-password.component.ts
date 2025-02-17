import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-modify-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.scss']
})
export class ModifyPasswordComponent {
  newPassword: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: any) {
    if (!form.valid) {
      this.errorMessage = "❌ Tous les champs doivent être remplis.";
      return;
    }

    const payload = { password: this.newPassword };

    this.apiService.updateUser(payload).subscribe({
      next: () => {
        console.log("✅ Mot de passe mis à jour !");
        this.router.navigate(['/account']);
      },
      error: (error: any) => {
        console.error("❌ Erreur lors de la mise à jour :", error);
        this.errorMessage = "Impossible de mettre à jour le mot de passe.";
      }
    });
  }
}
