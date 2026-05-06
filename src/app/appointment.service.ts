import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Appointment, AppointmentStatus } from './types';

// Detecta a URL do backend dinamicamente
const getApiUrl = () => {
  // Em produção (Vercel), use a URL do Railway
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin.includes('localhost') 
      ? 'http://localhost:3333'
      : (window as any).__API_URL__ || 'https://seu-backend-railway.railway.app';
  }
  // Em desenvolvimento, use localhost
  return 'http://localhost:3333';
};

const API_BASE_URL = getApiUrl();

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();
  private eventSource?: EventSource;

  constructor(private http: HttpClient, private zone: NgZone) {
    this.fetchAppointments();
    this.initAppointmentStream();
  }

  private fetchAppointments(): void {
    this.http.get<Appointment[]>(`${API_BASE_URL}/appointments`)
      .pipe(catchError(this.handleError))
      .subscribe((appointments) => {
        this.appointmentsSubject.next(appointments);
      });
  }

  private initAppointmentStream(): void {
    if (typeof EventSource === 'undefined') {
      return;
    }

    this.eventSource = new EventSource(`${API_BASE_URL}/stream`);

    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            this.appointmentsSubject.next(data);
          } else if (data && Array.isArray(data.appointments)) {
            this.appointmentsSubject.next(data.appointments);
          }
        } catch (error) {
          console.error('Erro ao processar SSE:', error);
        }
      });
    };

    this.eventSource.onerror = () => {
      console.warn('Conexão SSE perdida. O frontend continuará funcionando com os dados carregados.');
    };
  }

  private handleError(error: any) {
    console.error('AppointmentService error:', error);
    return throwError(() => new Error('Erro ao comunicar com o backend.'));
  }

  get appointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  addAppointment(appointment: Appointment): void {
    const previousAppointments = this.appointments;
    const optimisticAppointments = [...previousAppointments, appointment];
    this.appointmentsSubject.next(optimisticAppointments);

    this.http.post<Appointment>(`${API_BASE_URL}/appointments`, appointment)
      .pipe(catchError((error) => {
        console.error('Erro ao criar agendamento:', error);
        this.appointmentsSubject.next(previousAppointments);
        return this.handleError(error);
      }))
      .subscribe((createdAppointment) => {
        const newAppointments = this.appointments.map((apt) =>
          apt.id === createdAppointment.id ? createdAppointment : apt
        );
        this.appointmentsSubject.next(newAppointments);
      });
  }

  deleteAppointment(id: string): void {
    const previousAppointments = this.appointments;
    const newAppointments = previousAppointments.filter((apt) => apt.id !== id);
    this.appointmentsSubject.next(newAppointments);

    this.http.delete(`${API_BASE_URL}/appointments/${id}`)
      .pipe(catchError((error) => {
        console.error('Erro ao deletar agendamento:', error);
        this.appointmentsSubject.next(previousAppointments);
        return this.handleError(error);
      }))
      .subscribe();
  }

  updateStatus(id: string, status: AppointmentStatus): void {
    this.http.patch<Appointment>(`${API_BASE_URL}/appointments/${id}/status`, { status })
      .pipe(catchError(this.handleError))
      .subscribe((updatedAppointment) => {
        const newAppointments = this.appointments.map((apt) =>
          apt.id === id ? updatedAppointment : apt
        );
        this.appointmentsSubject.next(newAppointments);
      });
  }
}
