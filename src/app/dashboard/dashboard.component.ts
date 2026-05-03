import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentStatus, Service } from '../types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Input() appointments!: Appointment[];
  @Input() services!: Service[];
  Math = Math;

  get pastRevenue(): number {
    return this.appointments
      .filter(a => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + this.getServicePrice(a.serviceId), 0);
  }

  get futureRevenue(): number {
    return this.appointments
      .filter(a => a.status === AppointmentStatus.SCHEDULED)
      .reduce((sum, a) => sum + this.getServicePrice(a.serviceId), 0);
  }

  get data() {
    return [
      { name: 'Realizado', value: this.pastRevenue, color: '#ec4899' },
      { name: 'A Receber', value: this.futureRevenue, color: '#a855f7' },
    ];
  }

  get totalAppointments(): number {
    return this.appointments.length;
  }

  get completedCount(): number {
    return this.appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
  }

  get statusData() {
    return [
      { name: 'Agendado', value: this.appointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length, fill: '#f472b6' },
      { name: 'Concluído', value: this.completedCount, fill: '#34d399' },
      { name: 'Cancelado', value: this.appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length, fill: '#9ca3af' },
    ].filter(d => d.value > 0);
  }

  private getServicePrice(id: string): number {
    return this.services.find(s => s.id === id)?.price || 0;
  }
}