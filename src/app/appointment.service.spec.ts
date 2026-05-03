import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentStatus } from './types';

const API_BASE_URL = 'http://localhost:3333';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;
  let mockEventSourceInstance: any;

  const appointmentMock: Appointment = {
    id: '1',
    clientName: 'João',
    serviceId: 'haircut',
    date: '2026-05-10',
    status: AppointmentStatus.SCHEDULED,
  };

  beforeEach(() => {
    mockEventSourceInstance = {
      onmessage: null,
      onerror: null,
      close: jasmine.createSpy('close'),
    };

    Object.defineProperty(window, 'EventSource', {
      writable: true,
      configurable: true,
      value: jasmine
        .createSpy('EventSource')
        .and.returnValue(mockEventSourceInstance),
    });

    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(`${API_BASE_URL}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush([appointmentMock]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch appointments on init', () => {
    expect(service.appointments).toEqual([appointmentMock]);
  });

  it('should initialize EventSource stream', () => {
    expect(window.EventSource).toHaveBeenCalledWith(`${API_BASE_URL}/stream`);
  });

  it('should update appointments when SSE returns an array', () => {
    const newAppointments: Appointment[] = [
      {
        id: '2',
        clientName: 'Maria',
        serviceId: 'nails',
        date: '2026-05-11',
        status: AppointmentStatus.SCHEDULED,
      },
    ];

    mockEventSourceInstance.onmessage({
      data: JSON.stringify(newAppointments),
    });

    expect(service.appointments).toEqual(newAppointments);
  });

  it('should update appointments when SSE returns an object with appointments', () => {
    const newAppointments: Appointment[] = [
      {
        id: '3',
        clientName: 'Ana',
        serviceId: 'massage',
        date: '2026-05-12',
        status: AppointmentStatus.COMPLETED,
      },
    ];

    mockEventSourceInstance.onmessage({
      data: JSON.stringify({ appointments: newAppointments }),
    });

    expect(service.appointments).toEqual(newAppointments);
  });

  it('should add appointment optimistically', () => {
    const newAppointment: Appointment = {
      id: '2',
      clientName: 'Maria',
      serviceId: 'nails',
      date: '2026-05-11',
      status: AppointmentStatus.SCHEDULED,
    };

    service.addAppointment(newAppointment);

    expect(service.appointments).toEqual([appointmentMock, newAppointment]);

    const req = httpMock.expectOne(`${API_BASE_URL}/appointments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAppointment);

    req.flush(newAppointment);

    expect(service.appointments).toEqual([appointmentMock, newAppointment]);
  });

  it('should delete appointment optimistically', () => {
    service.deleteAppointment('1');

    expect(service.appointments).toEqual([]);

    const req = httpMock.expectOne(`${API_BASE_URL}/appointments/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});

    expect(service.appointments).toEqual([]);
  });

  it('should update appointment status', () => {
    const updatedAppointment: Appointment = {
      ...appointmentMock,
      status: AppointmentStatus.COMPLETED,
    };

    service.updateStatus('1', AppointmentStatus.COMPLETED);

    const req = httpMock.expectOne(`${API_BASE_URL}/appointments/1/status`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      status: AppointmentStatus.COMPLETED,
    });

    req.flush(updatedAppointment);

    expect(service.appointments).toEqual([updatedAppointment]);
  });
});