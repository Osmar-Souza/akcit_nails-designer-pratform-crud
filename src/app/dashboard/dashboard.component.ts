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

  get totalAppointments(): number {
    return this.appointments.length;
  }

  get scheduledCount(): number {
    return this.appointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length;
  }

  get completedCount(): number {
    return this.appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
  }

  get cancelledCount(): number {
    return this.appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length;
  }

  get statusData() {
    return [
      { name: 'Agendado', value: this.scheduledCount, fill: '#f472b6' },
      { name: 'Concluído', value: this.completedCount, fill: '#34d399' },
      { name: 'Cancelado', value: this.cancelledCount, fill: '#9ca3af' },
    ].filter(item => item.value > 0);
  }

  get serviceRevenue() {
    return this.services.map(service => ({
      service,
      revenue: this.appointments
        .filter(a => a.serviceId === service.id && a.status === AppointmentStatus.COMPLETED)
        .reduce((sum, a) => sum + this.getServicePrice(a.serviceId), 0)
    }));
  }

  get upcomingAppointments(): Appointment[] {
    return this.appointments
      .filter(a => a.status === AppointmentStatus.SCHEDULED)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }

  get data() {
    return [
      { name: 'Realizado', value: this.pastRevenue, color: '#ec4899' },
      { name: 'A Receber', value: this.futureRevenue, color: '#a855f7' },
    ];
  }

  getServiceName(id: string): string {
    return this.services.find(s => s.id === id)?.name || 'Serviço desconhecido';
  }

  getServicePrice(id: string): number {
    return this.services.find(s => s.id === id)?.price || 0;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
