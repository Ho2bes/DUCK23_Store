import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MyOrder, OrderService } from '../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  orders: MyOrder[] = [];
  loading = false;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération commandes', err);
        this.loading = false;
      },
    });
  }

  viewOrder(id: number) {
    this.router.navigate(['/order', id]);
  }
}
