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
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: any) {
    const payload = form.value;
    this.apiService.updateUser(payload).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/account']);
      }
    });
  }
}
