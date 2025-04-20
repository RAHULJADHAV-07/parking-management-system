export interface VehicleRecord {
  registrationNumber: string;
  vehicleType: string;
  customerName: string;
  customerMobile: string;
  slotNumber: number;
  entryTime: Date | null;
  exitTime?: Date | null;
  duration?: number;
  status: 'Parked' | 'Exited';
  createdAt?: Date;
  updatedAt?: Date;
}