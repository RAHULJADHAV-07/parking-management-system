import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  userRole: string = 'customer';
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    if (role !== 'customer') {
      this.router.navigate(['/login']);
    }
  }
}