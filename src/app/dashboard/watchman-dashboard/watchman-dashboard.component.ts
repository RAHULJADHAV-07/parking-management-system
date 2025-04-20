import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ParkingGridComponent } from '../../parking/parking-grid/parking-grid.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleRecord } from '../../models/vehicle-record.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-watchman-dashboard',
  templateUrl: './watchman-dashboard.component.html',
  styleUrls: ['./watchman-dashboard.component.css']
})
export class WatchmanDashboardComponent implements OnInit {
  @ViewChild(ParkingGridComponent) parkingGrid!: ParkingGridComponent;
  userRole: string = 'watchman';
  vehicleRecords: VehicleRecord[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    if (role !== 'watchman') {
      this.router.navigate(['/login']);
    }
    this.loadVehicleRecords();
  }

  handleVehicleAdded(vehicleData: any): void {
    this.parkingGrid.allocateVehicle(vehicleData);
  }

  loadVehicleRecords() {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService.getAllVehicleRecords()
        .pipe(
            catchError(this.handleError)
        )
        .subscribe({
            next: (response) => {
                this.vehicleRecords = response.records;
                this.isLoading = false;
                
                if (response.records.length === 0) {
                    this.errorMessage = 'No vehicle records found.';
                }
            },
            error: (error: string) => {
                this.errorMessage = error;
                this.isLoading = false;
            }
        });
}

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  exportToExcel() {
    if (this.vehicleRecords.length === 0) {
      this.errorMessage = 'No vehicle records available to export.';
      return;
    }

    const worksheetData = this.vehicleRecords.map(record => ({
      'Registration Number': record.registrationNumber,
      'Vehicle Type': record.vehicleType,
      'Customer Name': record.customerName,
      'Mobile Number': record.customerMobile,
      'Slot Number': record.slotNumber,
      'Entry Time': record.entryTime ? new Date(record.entryTime).toLocaleString() : 'N/A',
      'Exit Time': record.exitTime ? new Date(record.exitTime).toLocaleString() : 'N/A',
      'Duration (mins)': record.duration || 'N/A',
      'Status': record.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle Records');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Vehicle_Records.xlsx');
  }

  refreshRecords() {
    this.loadVehicleRecords();
  }

  removeVehicle(vehicleId: string): void {
    this.vehicleService.removeVehicle(vehicleId).subscribe({
      next: () => {
        this.parkingGrid.fetchStoredVehicles();
        alert('Vehicle removed successfully.');
      },
      error: (error: string) => {
        this.errorMessage = 'Error removing vehicle. Please try again.';
        console.error('Error removing vehicle:', error);
      }
    });
  }
}