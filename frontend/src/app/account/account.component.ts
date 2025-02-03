import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  user: any;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getUserInfo().subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    this.apiService.deleteUser().subscribe(() => {
      localStorage.removeItem('authToken');
      this.router.navigate(['/']);
    });
  }

  modifyPassword() {
    this.router.navigate(['/modify-password']);
  }

  modifyDetails() {
    this.router.navigate(['/modify-details']);
  }
}
