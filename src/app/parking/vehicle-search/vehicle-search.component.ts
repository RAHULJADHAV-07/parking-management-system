import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service'; // ✅ Ensure correct path

@Component({
  selector: 'app-vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.css']
})
export class VehicleSearchComponent {
  registrationNumber = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/)
  ]);

  searchResult: any = null;
  searchPerformed = false;

  constructor(private vehicleService: VehicleService) {} // ✅ Ensure correct DI

  searchVehicle() {
    if (this.registrationNumber.valid) {
      const regNumber = this.registrationNumber.value!; // ✅ Ensures it's not null
      this.vehicleService.searchVehicle(regNumber).subscribe(
        (data: any) => {
          this.searchResult = data;
          this.searchPerformed = true;
        },
        (error: any) => {
          this.searchResult = { found: false };
          this.searchPerformed = true;
        }
      );
    }
  }
  

  clearSearch() {
    this.registrationNumber.reset();
    this.searchResult = null;
    this.searchPerformed = false;
  }
}


