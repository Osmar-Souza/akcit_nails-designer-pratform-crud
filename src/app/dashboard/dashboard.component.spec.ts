import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Appointment, AppointmentStatus, Service } from '../types';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const mockServices: Service[] = [
        { id: '1', name: 'Manicure Simples', price: 30, durationMin: 45 },
        { id: '2', name: 'Pedicure Simples', price: 45, durationMin: 45 },
        { id: '3', name: 'Pé e Mão (Combo)', price: 70, durationMin: 90 }
    ];

    const mockAppointments: Appointment[] = [
        {
            id: '1',
            clientName: 'Ana Souza',
            serviceId: '1',
            date: '2026-05-01T10:00:00Z',
            status: AppointmentStatus.COMPLETED
        },
        {
            id: '2',
            clientName: 'Maria Silva',
            serviceId: '2',
            date: '2026-05-03T14:00:00Z',
            status: AppointmentStatus.SCHEDULED
        },
        {
            id: '3',
            clientName: 'João Santos',
            serviceId: '3',
            date: '2026-05-02T11:00:00Z',
            status: AppointmentStatus.CANCELLED
        },
        {
            id: '4',
            clientName: 'Paulo Costa',
            serviceId: '1',
            date: '2026-05-05T09:00:00Z',
            status: AppointmentStatus.COMPLETED
        },
        {
            id: '5',
            clientName: 'Lucia Pereira',
            serviceId: '2',
            date: '2026-05-10T15:00:00Z',
            status: AppointmentStatus.SCHEDULED
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;

        component.appointments = mockAppointments;
        component.services = mockServices;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('pastRevenue', () => {
        it('should calculate revenue from completed appointments', () => {
            expect(component.pastRevenue).toBe(60); // 30 + 30
        });

        it('should return 0 when no completed appointments', () => {
            component.appointments = component.appointments.filter(
                a => a.status !== AppointmentStatus.COMPLETED
            );

            expect(component.pastRevenue).toBe(0);
        });

        it('should only count COMPLETED status appointments', () => {
            const revenue = component.pastRevenue;
            const expectedRevenue = mockAppointments
                .filter(a => a.status === AppointmentStatus.COMPLETED)
                .reduce((sum, a) => sum + component.getServicePrice(a.serviceId), 0);

            expect(revenue).toBe(expectedRevenue);
        });
    });

    describe('futureRevenue', () => {
        it('should calculate revenue from scheduled appointments', () => {
            expect(component.futureRevenue).toBe(90); // 45 + 45
        });

        it('should return 0 when no scheduled appointments', () => {
            component.appointments = component.appointments.filter(
                a => a.status !== AppointmentStatus.SCHEDULED
            );

            expect(component.futureRevenue).toBe(0);
        });

        it('should only count SCHEDULED status appointments', () => {
            const revenue = component.futureRevenue;
            const expectedRevenue = mockAppointments
                .filter(a => a.status === AppointmentStatus.SCHEDULED)
                .reduce((sum, a) => sum + component.getServicePrice(a.serviceId), 0);

            expect(revenue).toBe(expectedRevenue);
        });
    });

    describe('totalAppointments', () => {
        it('should return total count of appointments', () => {
            expect(component.totalAppointments).toBe(5);
        });

        it('should include all statuses', () => {
            expect(component.totalAppointments).toBe(component.appointments.length);
        });

        it('should update when appointments change', () => {
            component.appointments = [mockAppointments[0]];

            expect(component.totalAppointments).toBe(1);
        });
    });

    describe('scheduledCount', () => {
        it('should return count of scheduled appointments', () => {
            expect(component.scheduledCount).toBe(2);
        });

        it('should only count SCHEDULED status', () => {
            const count = component.appointments.filter(
                a => a.status === AppointmentStatus.SCHEDULED
            ).length;

            expect(component.scheduledCount).toBe(count);
        });
    });

    describe('completedCount', () => {
        it('should return count of completed appointments', () => {
            expect(component.completedCount).toBe(2);
        });

        it('should only count COMPLETED status', () => {
            const count = component.appointments.filter(
                a => a.status === AppointmentStatus.COMPLETED
            ).length;

            expect(component.completedCount).toBe(count);
        });
    });

    describe('cancelledCount', () => {
        it('should return count of cancelled appointments', () => {
            expect(component.cancelledCount).toBe(1);
        });

        it('should only count CANCELLED status', () => {
            const count = component.appointments.filter(
                a => a.status === AppointmentStatus.CANCELLED
            ).length;

            expect(component.cancelledCount).toBe(count);
        });
    });

    describe('statusData', () => {
        it('should return array with status information', () => {
            const data = component.statusData;

            expect(Array.isArray(data)).toBe(true);
            expect(data.some(item => item.name === 'Agendado')).toBe(true);
            expect(data.some(item => item.name === 'Concluído')).toBe(true);
            expect(data.some(item => item.name === 'Cancelado')).toBe(true);
        });

        it('should include correct counts in statusData', () => {
            const data = component.statusData;
            const scheduled = data.find(item => item.name === 'Agendado');
            const completed = data.find(item => item.name === 'Concluído');

            expect(scheduled?.value).toBe(2);
            expect(completed?.value).toBe(2);
        });

        it('should filter out zero-count statuses', () => {
            component.appointments = [];

            expect(component.statusData.length).toBe(0);
        });

        it('should have correct colors for each status', () => {
            const data = component.statusData;

            expect(data.find(item => item.name === 'Agendado')?.fill).toBe('#f472b6');
            expect(data.find(item => item.name === 'Concluído')?.fill).toBe('#34d399');
            expect(data.find(item => item.name === 'Cancelado')?.fill).toBe('#9ca3af');
        });
    });

    describe('serviceRevenue', () => {
        it('should return revenue breakdown by service', () => {
            const revenue = component.serviceRevenue;

            expect(revenue.length).toBe(mockServices.length);
        });

        it('should calculate correct revenue per service', () => {
            const revenue = component.serviceRevenue;
            const manicureRevenue = revenue.find(r => r.service.id === '1')?.revenue;

            // Service 1 has 2 completed appointments
            expect(manicureRevenue).toBe(60);
        });

        it('should include all services even with zero revenue', () => {
            const revenue = component.serviceRevenue;

            expect(revenue.length).toBe(mockServices.length);
            expect(revenue.every(r => typeof r.revenue === 'number')).toBe(true);
        });
    });

    describe('upcomingAppointments', () => {
        it('should return only scheduled appointments', () => {
            const upcoming = component.upcomingAppointments;

            expect(upcoming.every(a => a.status === AppointmentStatus.SCHEDULED)).toBe(true);
        });

        it('should sort by date ascending', () => {
            const upcoming = component.upcomingAppointments;

            for (let i = 0; i < upcoming.length - 1; i++) {
                const date1 = new Date(upcoming[i].date).getTime();
                const date2 = new Date(upcoming[i + 1].date).getTime();
                expect(date1).toBeLessThanOrEqual(date2);
            }
        });

        it('should return max 4 appointments', () => {
            const manyAppointments = [...mockAppointments];
            for (let i = 0; i < 10; i++) {
                manyAppointments.push({
                    id: `new-${i}`,
                    clientName: `Client ${i}`,
                    serviceId: '1',
                    date: new Date(Date.now() + i * 86400000).toISOString(),
                    status: AppointmentStatus.SCHEDULED
                });
            }

            component.appointments = manyAppointments;

            expect(component.upcomingAppointments.length).toBeLessThanOrEqual(4);
        });

        it('should return empty array when no scheduled appointments', () => {
            component.appointments = component.appointments.filter(
                a => a.status !== AppointmentStatus.SCHEDULED
            );

            expect(component.upcomingAppointments.length).toBe(0);
        });
    });

    describe('getServiceName', () => {
        it('should return service name for valid ID', () => {
            expect(component.getServiceName('1')).toBe('Manicure Simples');
            expect(component.getServiceName('2')).toBe('Pedicure Simples');
        });

        it('should return default message for invalid ID', () => {
            expect(component.getServiceName('invalid')).toBe('Serviço desconhecido');
        });

        it('should handle non-existent service IDs', () => {
            expect(component.getServiceName('999')).toBe('Serviço desconhecido');
        });
    });

    describe('getServicePrice', () => {
        it('should return correct price for service', () => {
            expect(component.getServicePrice('1')).toBe(30);
            expect(component.getServicePrice('2')).toBe(45);
            expect(component.getServicePrice('3')).toBe(70);
        });

        it('should return 0 for invalid service ID', () => {
            expect(component.getServicePrice('invalid')).toBe(0);
        });

        it('should handle non-existent service IDs', () => {
            expect(component.getServicePrice('999')).toBe(0);
        });
    });

    describe('data getter', () => {
        it('should return revenue comparison data', () => {
            const data = component.data;

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(2);
        });

        it('should include Realizado and A Receber', () => {
            const data = component.data;

            expect(data.some(item => item.name === 'Realizado')).toBe(true);
            expect(data.some(item => item.name === 'A Receber')).toBe(true);
        });

        it('should have correct revenue values', () => {
            const data = component.data;
            const realizado = data.find(item => item.name === 'Realizado');

            expect(realizado?.value).toBe(component.pastRevenue);
        });

        it('should have correct colors', () => {
            const data = component.data;

            expect(data.find(item => item.name === 'Realizado')?.color).toBe('#ec4899');
            expect(data.find(item => item.name === 'A Receber')?.color).toBe('#a855f7');
        });
    });

    describe('Math property', () => {
        it('should expose Math object for template', () => {
            expect(component.Math).toBe(Math);
        });
    });
});
