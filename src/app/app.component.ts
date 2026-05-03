import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentService } from './appointment.service';
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

  constructor(public appointmentService: AppointmentService) {}

  handleLogin(adminUser: boolean) {
    this.isAdmin = adminUser;
    this.isAuthenticated = true;
    // If user is client, they cannot see dashboard, so force schedule tab
    if (!adminUser) {
      this.activeTab = 'schedule';
    } else {
      this.activeTab = 'dashboard';
    }
  }

  handleLogout() {
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

  onOpenNewBooking() {
    this.isModalOpen = true;
  }

  onCloseModal() {
    this.isModalOpen = false;
  }
}