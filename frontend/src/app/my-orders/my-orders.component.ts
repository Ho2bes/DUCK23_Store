import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MyOrder, OrderService } from '../services/order.service';

/* on crée un composant Angular pour afficher les commandes
de l'utilisateur et permettre la navigation vers les détails de chaque commande.*/
@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: MyOrder[] = [];
  loading = false;

  constructor(private orderService: OrderService, private router: Router) {}

  // on initialise le composant en chargeant les commandes de l'utilisateur via le service OrderService.
  // on gère également la navigation vers les détails d'une commande spécifique.
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

  // on navigue vers la page de détails de la commande sélectionnée en utilisant son ID.
  viewOrder(id: number) {
    this.router.navigate(['/order', id]);
  }
}
