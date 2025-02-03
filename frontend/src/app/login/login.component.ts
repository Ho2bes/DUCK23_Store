import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: any) {
    const payload = form.value;
    this.apiService.loginUser(payload).subscribe(response => {
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/account']);
      }
    });
  }
}
