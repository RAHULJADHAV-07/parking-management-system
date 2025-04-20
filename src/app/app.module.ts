import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';  // ✅ Added for alerts
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ParkingGridComponent } from './parking/parking-grid/parking-grid.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { WatchmanDashboardComponent } from './dashboard/watchman-dashboard/watchman-dashboard.component';
import { CustomerDashboardComponent } from './dashboard/customer-dashboard/customer-dashboard.component';
import { VehicleEntryComponent } from './parking/vehicle-entry/vehicle-entry.component';
import { VehicleSearchComponent } from './parking/vehicle-search/vehicle-search.component';

import { HeaderComponent } from './shared/header/header.component';
import { VehicleRecordsComponent } from './parking/vehicle-records/vehicle-records.component';
import { LoaderComponent } from './shared/loader/loader.component';

// Services
import { VehicleService } from './services/vehicle.service';  // ✅ Ensure this service is provided

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ParkingGridComponent,
    AdminDashboardComponent,
    WatchmanDashboardComponent,
    CustomerDashboardComponent,
    VehicleEntryComponent,
    VehicleSearchComponent,
    HeaderComponent,
    VehicleRecordsComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,  // ✅ Added for input styling
    MatSnackBarModule,
    MatTooltipModule,   // ✅ Added for success/error messages
    MatTableModule,
    MatProgressSpinnerModule
  ],
  providers: [VehicleService],  // ✅ Added VehicleService here
  bootstrap: [AppComponent]
})
export class AppModule { }
