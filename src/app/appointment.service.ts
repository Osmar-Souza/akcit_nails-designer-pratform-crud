import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment, AppointmentStatus } from './types';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>(this.loadFromStorage());
  public appointments$ = this.appointmentsSubject.asObservable();

  private loadFromStorage(): Appointment[] {
    const saved = localStorage.getItem('bella_appointments');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock initial data if empty
    return [
      { id: '1', clientName: 'Ana Souza', serviceId: '1', date: new Date(Date.now() - 86400000).toISOString(), status: AppointmentStatus.COMPLETED },
      { id: '2', clientName: 'Julia Pereira', serviceId: '5', date: new Date(Date.now() + 3600000).toISOString(), status: AppointmentStatus.SCHEDULED },
    ];
  }

  private saveToStorage(appointments: Appointment[]) {
    localStorage.setItem('bella_appointments', JSON.stringify(appointments));
  }

  get appointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  addAppointment(appointment: Appointment) {
    const newAppointments = [...this.appointments, appointment];
    this.appointmentsSubject.next(newAppointments);
    this.saveToStorage(newAppointments);
  }

  updateStatus(id: string, status: AppointmentStatus) {
    const newAppointments = this.appointments.map(apt =>
      apt.id === id ? { ...apt, status } : apt
    );
    this.appointmentsSubject.next(newAppointments);
    this.saveToStorage(newAppointments);
  }
}