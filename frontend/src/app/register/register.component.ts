import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: any) {
    const payload = form.value;
    this.apiService.registerUser(payload).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/login']);
      }
    });
  }
}
