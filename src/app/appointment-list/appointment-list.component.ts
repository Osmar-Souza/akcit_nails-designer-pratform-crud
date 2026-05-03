import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentStatus, Service } from '../types';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
  @Input() appointments!: Appointment[];
  @Input() services!: Service[];
  @Output() updateStatus = new EventEmitter<{id: string, status: AppointmentStatus}>();
  @Input() isAdmin!: boolean;

  AppointmentStatus = AppointmentStatus;

  get sortedAppointments(): Appointment[] {
    return [...this.appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

  getStatusColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case AppointmentStatus.CANCELLED: return 'bg-gray-100 text-gray-500 border-gray-200 decoration-line-through';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  }

  onUpdateStatus(id: string, status: AppointmentStatus) {
    this.updateStatus.emit({ id, status });
  }
}