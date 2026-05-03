import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppointmentListComponent } from './appointment-list.component';
import { Appointment, AppointmentStatus, Service } from '../types';

describe('AppointmentListComponent', () => {
    let component: AppointmentListComponent;
    let fixture: ComponentFixture<AppointmentListComponent>;

    const mockServices: Service[] = [
        { id: '1', name: 'Manicure Simples', price: 30, durationMin: 45 },
        { id: '2', name: 'Pedicure Simples', price: 45, durationMin: 45 },
    ];

    const mockAppointments: Appointment[] = [
        {
            id: '1',
            clientName: 'Ana Souza',
            serviceId: '1',
            date: '2026-05-03T10:00:00Z',
            status: AppointmentStatus.SCHEDULED
        },
        {
            id: '2',
            clientName: 'Maria Silva',
            serviceId: '2',
            date: '2026-05-05T14:00:00Z',
            status: AppointmentStatus.COMPLETED
        },
        {
            id: '3',
            clientName: 'João Santos',
            serviceId: '1',
            date: '2026-05-01T11:00:00Z',
            status: AppointmentStatus.CANCELLED
        },
        {
            id: '4',
            clientName: 'Paulo Costa',
            serviceId: '2',
            date: '2026-05-06T09:00:00Z',
            status: AppointmentStatus.SCHEDULED
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppointmentListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentListComponent);
        component = fixture.componentInstance;

        component.appointments = mockAppointments;
        component.services = mockServices;
        component.isAdmin = false;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('AppointmentStatus enum', () => {
        it('should have AppointmentStatus property', () => {
            expect(component.AppointmentStatus).toBe(AppointmentStatus);
        });
    });

    describe('sortedAppointments', () => {
        it('should return appointments sorted by date ascending', () => {
            component.isAdmin = true;

            const sorted = component.sortedAppointments;

            for (let i = 0; i < sorted.length - 1; i++) {
                const date1 = new Date(sorted[i].date).getTime();
                const date2 = new Date(sorted[i + 1].date).getTime();
                expect(date1).toBeLessThanOrEqual(date2);
            }
        });

        it('should filter out non-scheduled appointments for non-admin users', () => {
            component.isAdmin = false;

            const sorted = component.sortedAppointments;

            expect(sorted.every(a => a.status === AppointmentStatus.SCHEDULED)).toBe(true);
        });

        it('should show all appointments for admin users', () => {
            component.isAdmin = true;

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(4);
        });

        it('should show only 2 appointments for non-admin users (2 scheduled out of 4)', () => {
            component.isAdmin = false;

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(2);
        });

        it('should not mutate original appointments array', () => {
            const originalLength = component.appointments.length;
            component.isAdmin = false;

            const sorted = component.sortedAppointments;

            expect(component.appointments.length).toBe(originalLength);
        });

        it('should handle empty appointments array', () => {
            component.appointments = [];

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(0);
        });

        it('should return empty array for non-admin when no scheduled appointments', () => {
            component.isAdmin = false;
            component.appointments = [
                {
                    id: '1',
                    clientName: 'Test',
                    serviceId: '1',
                    date: '2026-05-03T10:00:00Z',
                    status: AppointmentStatus.COMPLETED
                }
            ];

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(0);
        });
    });

    describe('getServiceName', () => {
        it('should return service name for valid ID', () => {
            expect(component.getServiceName('1')).toBe('Manicure Simples');
            expect(component.getServiceName('2')).toBe('Pedicure Simples');
        });

        it('should return default message for invalid ID', () => {
            expect(component.getServiceName('999')).toBe('Serviço desconhecido');
        });
    });

    describe('getServicePrice', () => {
        it('should return correct price for valid service', () => {
            expect(component.getServicePrice('1')).toBe(30);
            expect(component.getServicePrice('2')).toBe(45);
        });

        it('should return 0 for invalid service ID', () => {
            expect(component.getServicePrice('999')).toBe(0);
        });
    });

    describe('formatDate', () => {
        it('should format date to pt-BR locale', () => {
            const formatted = component.formatDate('2026-05-03T10:30:00Z');

            expect(formatted).toContain('03');
            expect(formatted).toContain('30');
            expect(formatted).toContain('mai');
        });

        it('should format different dates correctly', () => {
            const date1 = component.formatDate('2026-05-03T10:30:00Z');
            const date2 = component.formatDate('2026-06-15T14:45:00Z');

            expect(date1).not.toBe(date2);
        });

        it('should handle various time formats', () => {
            const formattedTimes = [
                component.formatDate('2026-05-03T09:00:00Z'),
                component.formatDate('2026-05-03T14:30:00Z'),
                component.formatDate('2026-05-03T23:59:00Z')
            ];

            expect(formattedTimes.every(t => typeof t === 'string')).toBe(true);
        });
    });

    describe('getStatusColor', () => {
        it('should return green colors for COMPLETED status', () => {
            const color = component.getStatusColor(AppointmentStatus.COMPLETED);

            expect(color).toBe('bg-green-100 text-green-700 border-green-200');
        });

        it('should return gray colors for CANCELLED status', () => {
            const color = component.getStatusColor(AppointmentStatus.CANCELLED);

            expect(color).toBe('bg-gray-100 text-gray-500 border-gray-200 decoration-line-through');
        });

        it('should return blue colors for SCHEDULED status', () => {
            const color = component.getStatusColor(AppointmentStatus.SCHEDULED);

            expect(color).toBe('bg-blue-50 text-blue-700 border-blue-200');
        });

        it('should handle unknown status with default colors', () => {
            const color = component.getStatusColor('Unknown' as any);

            expect(color).toBe('bg-blue-50 text-blue-700 border-blue-200');
        });
    });

    describe('onUpdateStatus', () => {
        it('should emit updateStatus event with id and status', (done) => {
            component.updateStatus.subscribe((event) => {
                expect(event.id).toBe('1');
                expect(event.status).toBe(AppointmentStatus.COMPLETED);
                done();
            });

            component.onUpdateStatus('1', AppointmentStatus.COMPLETED);
        });

        it('should emit correct data format', (done) => {
            component.updateStatus.subscribe((event) => {
                expect(event).toEqual({ id: '2', status: AppointmentStatus.SCHEDULED });
                done();
            });

            component.onUpdateStatus('2', AppointmentStatus.SCHEDULED);
        });

        it('should handle multiple emissions', () => {
            let emissionCount = 0;

            component.updateStatus.subscribe(() => {
                emissionCount++;
            });

            component.onUpdateStatus('1', AppointmentStatus.COMPLETED);
            component.onUpdateStatus('2', AppointmentStatus.CANCELLED);
            component.onUpdateStatus('3', AppointmentStatus.SCHEDULED);

            expect(emissionCount).toBe(3);
        });
    });

    describe('onDeleteAppointment', () => {
        it('should emit deleteAppointment event with id', (done) => {
            component.deleteAppointment.subscribe((id) => {
                expect(id).toBe('1');
                done();
            });

            component.onDeleteAppointment('1');
        });

        it('should emit correct ID', (done) => {
            component.deleteAppointment.subscribe((id) => {
                expect(id).toBe('test-id-123');
                done();
            });

            component.onDeleteAppointment('test-id-123');
        });

        it('should handle multiple delete emissions', () => {
            let deletionCount = 0;

            component.deleteAppointment.subscribe(() => {
                deletionCount++;
            });

            component.onDeleteAppointment('1');
            component.onDeleteAppointment('2');
            component.onDeleteAppointment('3');

            expect(deletionCount).toBe(3);
        });
    });

    describe('Integration scenarios', () => {
        it('should handle admin seeing all appointment statuses', () => {
            component.isAdmin = true;
            component.appointments = mockAppointments;

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(4);
            const statuses = sorted.map(a => a.status);
            expect(statuses).toContain(AppointmentStatus.SCHEDULED);
            expect(statuses).toContain(AppointmentStatus.COMPLETED);
            expect(statuses).toContain(AppointmentStatus.CANCELLED);
        });

        it('should handle client seeing only scheduled appointments', () => {
            component.isAdmin = false;
            component.appointments = mockAppointments;

            const sorted = component.sortedAppointments;

            expect(sorted.length).toBe(2);
            expect(sorted.every(a => a.status === AppointmentStatus.SCHEDULED)).toBe(true);
        });

        it('should format and color appointments correctly', () => {
            component.isAdmin = true;

            const scheduled = mockAppointments.find(a => a.status === AppointmentStatus.SCHEDULED);
            const completed = mockAppointments.find(a => a.status === AppointmentStatus.COMPLETED);

            expect(component.getStatusColor(scheduled!.status)).toContain('blue');
            expect(component.getStatusColor(completed!.status)).toContain('green');
        });

        it('should provide service information for display', () => {
            const appointment = mockAppointments[0];

            const name = component.getServiceName(appointment.serviceId);
            const price = component.getServicePrice(appointment.serviceId);

            expect(name).toBe('Manicure Simples');
            expect(price).toBe(30);
        });
    });
});
