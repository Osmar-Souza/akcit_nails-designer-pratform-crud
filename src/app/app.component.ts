import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentService } from './appointment.service';
import { AuthService } from './auth.service';
import { Appointment, AppointmentStatus } from './types';
import { AVAILABLE_SERVICES } from './constants';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { NewBookingModalComponent } from './new-booking-modal/new-booking-modal.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LayoutComponent,
    DashboardComponent,
    AppointmentListComponent,
    NewBookingModalComponent,
    AiAssistantComponent,
    LoginScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthenticated = false;
  isAdmin = false;
  activeTab = 'dashboard';
  isModalOpen = false;
  AVAILABLE_SERVICES = AVAILABLE_SERVICES;

  constructor(
    public appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated;
    this.isAdmin = this.authService.isAdmin;
  }

  handleLogin(adminUser: boolean) {
    const login$ = adminUser
      ? this.authService.loginAsAdmin()
      : this.authService.loginAsClient();

    login$.subscribe({
      next: () => {
        this.isAuthenticated = true;
        this.isAdmin = this.authService.isAdmin;
        this.activeTab = adminUser ? 'dashboard' : 'schedule';
      },
      error: (error) => {
        console.error('Falha ao autenticar:', error);
        this.isAuthenticated = false;
        this.isAdmin = false;
      }
    });
  }

  handleLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.activeTab = 'dashboard';
  }

  handleNewBooking(clientName: string, serviceId: string, date: string) {
    const newAppointment: Appointment = {
      id: uuidv4(),
      clientName,
      serviceId,
      date,
      status: AppointmentStatus.SCHEDULED
    };
    this.appointmentService.addAppointment(newAppointment);
    this.activeTab = 'schedule'; // Switch to list view to see it
  }

  handleUpdateStatus(id: string, status: AppointmentStatus) {
    this.appointmentService.updateStatus(id, status);
  }

  handleDeleteAppointment(id: string) {
    this.appointmentService.deleteAppointment(id);
  }

  onOpenNewBooking() {
    this.isModalOpen = true;
  }

  onCloseModal() {
    this.isModalOpen = false;
  }
}