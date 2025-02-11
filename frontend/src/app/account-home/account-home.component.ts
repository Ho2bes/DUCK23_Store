import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 🔥 Ajoute cette ligne

@Component({
  selector: 'app-account-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // 🔥 Ajoute RouterModule ici
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.scss']
})
export class AccountHomeComponent {}
