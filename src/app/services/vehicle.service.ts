import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { VehicleRecord } from '../models/vehicle-record.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000/api/vehicles';
  private vehiclesSubject = new BehaviorSubject<any[]>([]);
  public vehicles$ = this.vehiclesSubject.asObservable();

  constructor(private http: HttpClient) { }

  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, vehicleData).pipe(
      tap(response => {
        this.getAllVehicles().subscribe();
      })
    );
  }

  getAllVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-vehicles`).pipe(
      tap(vehicles => this.vehiclesSubject.next(vehicles))
    );
  }

  searchVehicle(registrationNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/${registrationNumber}`);
  }
  
  removeVehicleByNumber(regNumber: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-by-number/${regNumber}`).pipe(
      switchMap(() => this.getAllVehicles()),
      catchError(error => {
        console.error('Error removing vehicle by number:', error);
        return throwError(() => new Error('Error removing vehicle by registration number.'));
      })
    );
  }
  getDashboardStats(): Observable<{
    totalSlots: number;
    occupiedSlots: number;
    availableSlots: number;
    todayEntries: number;
  }> {
    return this.http.get<{
      totalSlots: number;
      occupiedSlots: number;
      availableSlots: number;
      todayEntries: number;
    }>(`${this.apiUrl}/dashboard-stats`);
  }

  createVehicleRecord(vehicleData: any): Observable<any> {
    console.log('Attempting to create vehicle record:', vehicleData);
    return this.http.post(`${this.apiUrl}/record`, vehicleData).pipe(
        tap(response => {
            console.log('Vehicle record creation response:', response);
        }),
        catchError(error => {
            console.error('Vehicle record creation error:', error);
            return throwError(() => new Error('Failed to create vehicle record'));
        })
    );
}

getAllVehicleRecords(): Observable<any> {
  console.log('Fetching vehicle records from:', this.apiUrl);
  return this.http.get<{
      records: VehicleRecord[];
      totalRecords: number;
      currentPage: number;
      totalPages: number;
  }>(`${this.apiUrl}/record`);
}

  removeVehicle(vehicleId: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${vehicleId}`).pipe(
        switchMap(() => this.getAllVehicles()),
        catchError(error => {
          console.error('Error removing vehicle:', error);
          return throwError(() => new Error('Error removing vehicle.'));
        })
      );
    }
}
