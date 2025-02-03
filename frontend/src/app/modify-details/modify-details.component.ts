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
