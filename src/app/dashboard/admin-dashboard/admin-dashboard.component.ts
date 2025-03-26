import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userRole: string = 'admin';
  
  // Statistics
  totalSlots: number = 0;
  occupiedSlots: number = 0;
  availableSlots: number = 0;
  todayEntries: number = 0;
  
  constructor(
    private router: Router,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      this.router.navigate(['/login']);
    }

    // Fetch dashboard statistics
    this.fetchDashboardStats();
  }

  fetchDashboardStats(): void {
    this.vehicleService.getDashboardStats().subscribe(
      (stats) => {
        this.totalSlots = stats.totalSlots;
        this.occupiedSlots = stats.occupiedSlots;
        this.availableSlots = stats.availableSlots;
        this.todayEntries = stats.todayEntries;
      },
      (error) => {
        console.error('Error fetching dashboard stats:', error);
        // Optionally, show an error message to the user
      }
    );
  }
}