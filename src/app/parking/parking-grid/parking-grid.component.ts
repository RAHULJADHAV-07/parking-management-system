import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { VehicleService } from 'src/app/services/vehicle.service';

interface ParkingSlot {
  id: string;
  number: number;
  isOccupied: boolean;
  vehicleInfo?: {
    registrationNumber: string;
    vehicleType: string;
    entryTime: Date;
    customerName: string;
    customerMobile: string;
  };
}

@Component({
  selector: 'app-parking-grid',
  templateUrl: './parking-grid.component.html',
  styleUrls: ['./parking-grid.component.css']
})
export class ParkingGridComponent implements OnInit, AfterViewInit {
  @Input() userRole: string = '';

  @ViewChildren(CdkDropList) dropListElements!: QueryList<CdkDropList>;
  dropLists: any[] = [];

  totalSlots: number = 100;
  columns: number = 5;
  rows: number = Math.ceil(this.totalSlots / this.columns);
  parkingSlots: ParkingSlot[] = [];
  parkingGrid: ParkingSlot[][] = [];
  vehicles: any[] = [];

  constructor(private vehicleService: VehicleService) {
    this.vehicleService.vehicles$.subscribe(vehicles => {
      this.vehicles = vehicles;
      this.arrangeIntoGrid();
    });
  }

  ngOnInit(): void {
    this.initializeParkingSlots();
    this.fetchStoredVehicles();
    
    // Subscribe to vehicle updates
    this.vehicleService.vehicles$.subscribe(vehicles => {
      this.updateParkingGrid(vehicles);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dropLists = this.dropListElements.toArray();
    }, 0);
  }

  initializeParkingSlots(): void {
    this.parkingSlots = Array.from({ length: this.totalSlots }, (_, i) => ({
      id: `slot-${i + 1}`,
      number: i + 1,
      isOccupied: false
    }));
    this.arrangeIntoGrid();
  }

  fetchStoredVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(
      (vehicles) => {
        this.updateParkingGrid(vehicles);
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  updateParkingGrid(vehicles: any[]): void {
    // Reset all slots first
    this.parkingSlots.forEach(slot => {
      slot.isOccupied = false;
      slot.vehicleInfo = undefined;
    });

    // Populate occupied slots
    vehicles.forEach((vehicle: any) => {
      const slotIndex = this.parkingSlots.findIndex(slot => slot.number === vehicle.slotNumber);
      
      if (slotIndex !== -1) {
        this.parkingSlots[slotIndex].isOccupied = true;
        this.parkingSlots[slotIndex].vehicleInfo = {
          registrationNumber: vehicle.registrationNumber,
          vehicleType: vehicle.vehicleType,
          entryTime: new Date(vehicle.entryTime),
          customerName: vehicle.customerName,
          customerMobile: vehicle.customerMobile
        };
      }
    });

    this.arrangeIntoGrid();
  }

  arrangeIntoGrid(): void {
    this.parkingGrid = [];
    for (let i = 0; i < this.totalSlots; i += this.columns) {
      this.parkingGrid.push(this.parkingSlots.slice(i, i + this.columns));
    }
  }

  drop(event: CdkDragDrop<ParkingSlot[]>): void {
    if (this.userRole !== 'customer') {
      const previousSlot = event.previousContainer.data[event.previousIndex];
      const targetSlot = event.container.data[event.currentIndex];

      if (!targetSlot.isOccupied && previousSlot.isOccupied) {
        targetSlot.isOccupied = true;
        targetSlot.vehicleInfo = previousSlot.vehicleInfo;
        previousSlot.isOccupied = false;
        previousSlot.vehicleInfo = undefined;
      }
      this.arrangeIntoGrid();
    }
  }

  allocateVehicle(vehicleInfo: any): void {
    const slotIndex = this.parkingSlots.findIndex(slot => slot.number === vehicleInfo.slotNumber);

    if (slotIndex !== -1 && vehicleInfo.slotNumber && !this.parkingSlots[slotIndex].isOccupied) {
      this.parkingSlots[slotIndex].isOccupied = true;
      this.parkingSlots[slotIndex].vehicleInfo = {
        ...vehicleInfo,
        entryTime: new Date()
      };
      this.arrangeIntoGrid();
    } else {
      alert(`Slot ${vehicleInfo.slotNumber} is already occupied or invalid!`);
    }
  }
}