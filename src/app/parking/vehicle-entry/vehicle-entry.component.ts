import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-entry',
  templateUrl: './vehicle-entry.component.html',
  styleUrls: ['./vehicle-entry.component.css']
})
export class VehicleEntryComponent {
  @Output() vehicleAdded = new EventEmitter<any>();
  vehicleForm: FormGroup;
  removeVehicleForm: FormGroup; // ✅ New Form for Removing Vehicles
  vehicleTypes = [
    { value: 'Car', viewValue: 'Car' },
    { value: 'Bike', viewValue: 'Bike' },
    { value: 'Truck', viewValue: 'Truck' },
    { value: 'Other', viewValue: 'Other' }
  ];
  existingSlots: Set<number> = new Set();
  vehicles$ = this.vehicleService.vehicles$;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    // ✅ Form for Adding Vehicles
    this.vehicleForm = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-[0-9]{1,2}-[A-Z]{1,2}-[0-9]{1,4}$')]],
      vehicleType: ['Car', Validators.required],
      customerName: ['', Validators.required],
      customerMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      slotNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    // ✅ Form for Removing Vehicles
    this.removeVehicleForm = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-[0-9]{1,2}-[A-Z]{1,2}-[0-9]{1,4}$')]]
    });

    // Subscribe to vehicles$ and update slots in real time
    this.vehicles$.subscribe(
      vehicles => {
        this.existingSlots = new Set(vehicles.map(vehicle => vehicle.slotNumber));
      },
      error => console.error('Error loading slots:', error)
    );
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      const vehicleData = {
        registrationNumber: this.vehicleForm.value.registrationNumber.trim(),
        vehicleType: this.vehicleForm.value.vehicleType,
        customerName: this.vehicleForm.value.customerName.trim(),
        customerMobile: this.vehicleForm.value.customerMobile.trim(),
        slotNumber: Number(this.vehicleForm.value.slotNumber)
      };

      if (this.existingSlots.has(vehicleData.slotNumber)) {
        alert(`⚠️ Slot ${vehicleData.slotNumber} is already occupied. Please choose another slot.`);
        return;
      }

      // Additional validation to ensure slot number is within valid range
      if (vehicleData.slotNumber < 1 || vehicleData.slotNumber > 100) {
        alert('⚠️ Invalid slot number. Please choose a slot between 1 and 100.');
        return;
      }

      console.log('🚀 Sending vehicle data:', vehicleData);

      this.vehicleService.addVehicle(vehicleData).subscribe(
        response => {
          this.vehicleAdded.emit(response);
          this.vehicleForm.reset({ vehicleType: 'Car' });
          // No need to manually add slot, will update via subscription
          alert('✅ Vehicle added successfully!');
        },
        error => {
          console.error('❌ Error adding vehicle:', error);
          alert('⚠️ Error adding vehicle. Please try again.');
        }
      );
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  // ✅ Remove Vehicle by Registration Number
  onRemoveVehicle() {
    if (this.removeVehicleForm.valid) {
      const registrationNumber = this.removeVehicleForm.value.registrationNumber.trim();

      this.vehicleService.removeVehicleByNumber(registrationNumber).subscribe({
        next: () => {
          alert(`✅ Vehicle with registration ${registrationNumber} removed successfully!`);
          this.removeVehicleForm.reset();
          // No need to manually update slots, will update via subscription
        },
        error: (err) => {
          console.error('❌ Error removing vehicle:', err);
          alert('⚠️ Error removing vehicle. Please try again.');
        }
      });
    } else {
      this.removeVehicleForm.markAllAsTouched();
    }
  }
}
