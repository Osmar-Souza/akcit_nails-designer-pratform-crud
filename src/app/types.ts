export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  COMPLETED = 'Concluído',
  CANCELLED = 'Cancelado'
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMin: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  serviceId: string;
  date: string; // ISO String
  status: AppointmentStatus;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}