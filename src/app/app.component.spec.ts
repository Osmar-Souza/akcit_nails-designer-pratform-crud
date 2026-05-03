import { AppComponent } from './app.component';
import { AppointmentService } from './appointment.service';
import { AppointmentStatus } from './types';

describe('AppComponent', () => {
  let component: AppComponent;
  let appointmentService: jasmine.SpyObj<AppointmentService>;

  beforeEach(() => {
    appointmentService = jasmine.createSpyObj<AppointmentService>(
      'AppointmentService',
      ['addAppointment', 'updateStatus', 'deleteAppointment']
    );

    component = new AppComponent(appointmentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login as admin and open dashboard', () => {
    component.handleLogin(true);

    expect(component.isAuthenticated).toBeTrue();
    expect(component.isAdmin).toBeTrue();
    expect(component.activeTab).toBe('dashboard');
  });

  it('should login as client and open schedule tab', () => {
    component.handleLogin(false);

    expect(component.isAuthenticated).toBeTrue();
    expect(component.isAdmin).toBeFalse();
    expect(component.activeTab).toBe('schedule');
  });

  it('should logout and reset state', () => {
    component.isAuthenticated = true;
    component.isAdmin = true;
    component.activeTab = 'schedule';

    component.handleLogout();

    expect(component.isAuthenticated).toBeFalse();
    expect(component.isAdmin).toBeFalse();
    expect(component.activeTab).toBe('dashboard');
  });

  it('should create a new booking', () => {
    component.handleNewBooking('João Silva', 'haircut', '2026-05-10');

    expect(appointmentService.addAppointment).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        clientName: 'João Silva',
        serviceId: 'haircut',
        date: '2026-05-10',
        status: AppointmentStatus.SCHEDULED,
      })
    );

    const appointment =
      appointmentService.addAppointment.calls.mostRecent().args[0];

    expect(appointment.id).toEqual(jasmine.any(String));
    expect(component.activeTab).toBe('schedule');
  });

  it('should update appointment status', () => {
    component.handleUpdateStatus('123', AppointmentStatus.COMPLETED);

    expect(appointmentService.updateStatus).toHaveBeenCalledOnceWith(
      '123',
      AppointmentStatus.COMPLETED
    );
  });

  it('should delete appointment', () => {
    component.handleDeleteAppointment('123');

    expect(appointmentService.deleteAppointment).toHaveBeenCalledOnceWith('123');
  });

  it('should open and close booking modal', () => {
    component.onOpenNewBooking();
    expect(component.isModalOpen).toBeTrue();

    component.onCloseModal();
    expect(component.isModalOpen).toBeFalse();
  });
});