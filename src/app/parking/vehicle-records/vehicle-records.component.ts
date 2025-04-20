import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleRecord } from '../../models/vehicle-record.model';

@Component({
  selector: 'app-vehicle-records',
  templateUrl: './vehicle-records.component.html',
  styleUrls: ['./vehicle-records.component.css']
})
export class VehicleRecordsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  showRecords = false;
  dataSource!: MatTableDataSource<VehicleRecord>;
  displayedColumns: string[] = [
    'registrationNumber',
    'vehicleType',
    'customerName',
    'slotNumber',
    'entryTime',
    'duration',
    'status'
  ];
  isLoading = false;
  errorMessage = '';

  constructor(private vehicleService: VehicleService) {
    this.dataSource = new MatTableDataSource<VehicleRecord>();
  }

  ngOnInit() {
    // Initialize component
  }
  
  ngAfterViewInit() {
    // Set the sort after the view init since this component will
    // be able to query its view for the initialized sort directive
    this.dataSource.sort = this.sort;
  }

  toggleRecords() {
    this.showRecords = !this.showRecords;
    if (this.showRecords && (!this.dataSource.data || this.dataSource.data.length === 0)) {
      this.loadVehicleRecords();
    }
  }

  loadVehicleRecords() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.vehicleService.getAllVehicleRecords().subscribe({
      next: (response: { records: VehicleRecord[] }) => {
        console.log('Received vehicle records:', response);
        
        if (!response.records || response.records.length === 0) {
          this.errorMessage = 'No vehicle records found.';
          this.isLoading = false;
          return;
        }
        
        const filteredRecords = response.records.filter(
          (record: VehicleRecord) => record.registrationNumber !== 'SYSTEM_TEST'
        );
        
        if (filteredRecords.length === 0) {
          this.errorMessage = 'No vehicle records found after filtering.';
          this.isLoading = false;
          return;
        }
        
        this.dataSource.data = filteredRecords.map(record => {
          const durationInMinutes = this.calculateDurationInMinutes(
            record.entryTime ? new Date(record.entryTime) : null, 
            record.exitTime ? new Date(record.exitTime) : null
          );
          return {
            ...record,
            entryTime: record.entryTime ? new Date(record.entryTime) : null,
            exitTime: record.exitTime ? new Date(record.exitTime) : null,
            duration: durationInMinutes
          };
        });
        
        this.isLoading = false;
        console.log('Processed records:', this.dataSource.data);
      },
      error: (error) => {
        console.error('Error loading vehicle records:', error);
        this.errorMessage = 'Failed to load vehicle records. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private calculateDurationInMinutes(entryTime: Date | null, exitTime: Date | null | undefined): number {
    if (!entryTime) return 0;
    
    const end = exitTime || new Date();
    return Math.round((end.getTime() - entryTime.getTime()) / (1000 * 60));
  }

  public formatDuration(durationInMinutes: number): string {
    if (durationInMinutes === 0) return 'N/A';
    
    if (durationInMinutes < 60) {
      return `${durationInMinutes} mins`;
    } else {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }
}