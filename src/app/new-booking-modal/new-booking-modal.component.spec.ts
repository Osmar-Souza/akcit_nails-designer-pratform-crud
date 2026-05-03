import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NewBookingModalComponent } from './new-booking-modal.component';
import { Service, Appointment, AppointmentStatus } from '../types';

describe('NewBookingModalComponent', () => {
    let component: NewBookingModalComponent;
    let fixture: ComponentFixture<NewBookingModalComponent>;

    const mockServices: Service[] = [
        { id: '1', name: 'Manicure Simples', price: 30, durationMin: 45 },
        { id: '2', name: 'Pedicure Simples', price: 45, durationMin: 45 }
    ];

    const mockAppointments: Appointment[] = [
        {
            id: '1',
            clientName: 'Test Client',
            serviceId: '1',
            date: '2026-05-03T10:00:00Z',
            status: AppointmentStatus.SCHEDULED
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewBookingModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewBookingModalComponent);
        component = fixture.componentInstance;

        component.services = mockServices;
        component.existingAppointments = mockAppointments;
        component.isOpen = false;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initialization', () => {
        it('should have empty form fields on init', () => {
            expect(component.clientName).toBe('');
            expect(component.serviceId).toBe('');
            expect(component.date).toBe('');
        });

        it('should have services input', () => {
            expect(component.services).toEqual(mockServices);
        });

        it('should have existingAppointments input', () => {
            expect(component.existingAppointments).toEqual(mockAppointments);
        });

        it('should have isOpen input as false', () => {
            expect(component.isOpen).toBe(false);
        });
    });

    describe('onSave', () => {
        it('should emit save event with form data when all fields are filled', (done) => {
            component.clientName = 'New Client';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.save.subscribe((data) => {
                expect(data.clientName).toBe('New Client');
                expect(data.serviceId).toBe('1');
                expect(data.date).toBe('2026-05-10T14:00:00');
                done();
            });

            component.onSave();
        });

        it('should not emit save event when clientName is empty', () => {
            spyOn(component.save, 'emit');
            component.clientName = '';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.onSave();

            expect(component.save.emit).not.toHaveBeenCalled();
        });

        it('should not emit save event when serviceId is empty', () => {
            spyOn(component.save, 'emit');
            component.clientName = 'New Client';
            component.serviceId = '';
            component.date = '2026-05-10T14:00:00';

            component.onSave();

            expect(component.save.emit).not.toHaveBeenCalled();
        });

        it('should not emit save event when date is empty', () => {
            spyOn(component.save, 'emit');
            component.clientName = 'New Client';
            component.serviceId = '1';
            component.date = '';

            component.onSave();

            expect(component.save.emit).not.toHaveBeenCalled();
        });

        it('should clear form after successful save', () => {
            component.clientName = 'New Client';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.onSave();

            expect(component.clientName).toBe('');
            expect(component.serviceId).toBe('');
            expect(component.date).toBe('');
        });

        it('should emit close event after successful save', (done) => {
            component.clientName = 'New Client';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            let savedEmitted = false;
            let closedEmitted = false;

            component.save.subscribe(() => {
                savedEmitted = true;
            });

            component.close.subscribe(() => {
                closedEmitted = true;
                if (savedEmitted && closedEmitted) {
                    done();
                }
            });

            component.onSave();
        });
    });

    describe('closeModal', () => {
        it('should emit close event', (done) => {
            component.close.subscribe(() => {
                done();
            });

            component.closeModal();
        });

        it('should clear all form fields', () => {
            component.clientName = 'Test';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.closeModal();

            expect(component.clientName).toBe('');
            expect(component.serviceId).toBe('');
            expect(component.date).toBe('');
        });

        it('should reset form fields regardless of previous state', () => {
            // First state
            component.clientName = 'Client 1';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.closeModal();

            expect(component.clientName).toBe('');
            expect(component.serviceId).toBe('');
            expect(component.date).toBe('');

            // Second state
            component.clientName = 'Client 2';
            component.serviceId = '2';
            component.date = '2026-05-11T15:00:00';

            component.closeModal();

            expect(component.clientName).toBe('');
            expect(component.serviceId).toBe('');
            expect(component.date).toBe('');
        });

        it('should handle multiple close calls', () => {
            spyOn(component.close, 'emit');

            component.closeModal();
            component.closeModal();
            component.closeModal();

            expect(component.close.emit).toHaveBeenCalledTimes(3);
        });
    });

    describe('Form validation workflow', () => {
        it('should accept valid appointment data', () => {
            component.clientName = 'Ana Silva';
            component.serviceId = '2';
            component.date = '2026-05-15T10:30:00';

            spyOn(component.save, 'emit');

            component.onSave();

            expect(component.save.emit).toHaveBeenCalled();
        });

        it('should reject when only clientName is provided', () => {
            component.clientName = 'Ana Silva';
            component.serviceId = '';
            component.date = '';

            spyOn(component.save, 'emit');

            component.onSave();

            expect(component.save.emit).not.toHaveBeenCalled();
        });

        it('should reject incomplete forms (2 out of 3 fields)', () => {
            spyOn(component.save, 'emit');

            // Case 1: clientName + serviceId
            component.clientName = 'Ana';
            component.serviceId = '1';
            component.date = '';
            component.onSave();
            expect(component.save.emit).not.toHaveBeenCalled();

            // Case 2: clientName + date
            component.clientName = 'Ana';
            component.serviceId = '';
            component.date = '2026-05-15T10:30:00';
            component.onSave();
            expect(component.save.emit).not.toHaveBeenCalled();

            // Case 3: serviceId + date
            component.clientName = '';
            component.serviceId = '1';
            component.date = '2026-05-15T10:30:00';
            component.onSave();
            expect(component.save.emit).not.toHaveBeenCalled();
        });

        it('should accept all valid service IDs', () => {
            spyOn(component.save, 'emit');

            mockServices.forEach((service) => {
                component.clientName = 'Client';
                component.serviceId = service.id;
                component.date = '2026-05-15T10:30:00';

                component.onSave();
            });

            expect(component.save.emit).toHaveBeenCalledTimes(mockServices.length);
        });
    });

    describe('EventEmitters', () => {
        it('should have save EventEmitter defined', () => {
            expect(component.save).toBeDefined();
        });

        it('should have close EventEmitter defined', () => {
            expect(component.close).toBeDefined();
        });

        it('should emit save and close in correct order', (done) => {
            const emitSequence: string[] = [];

            component.save.subscribe(() => {
                emitSequence.push('save');
            });

            component.close.subscribe(() => {
                emitSequence.push('close');
                expect(emitSequence).toEqual(['save', 'close']);
                done();
            });

            component.clientName = 'Test';
            component.serviceId = '1';
            component.date = '2026-05-10T14:00:00';

            component.onSave();
        });
    });
});
