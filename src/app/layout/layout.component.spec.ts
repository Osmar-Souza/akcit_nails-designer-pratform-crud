import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    component.activeTab = 'dashboard';
    component.isAdmin = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('visibleNavItems', () => {
    it('should show only non-admin items when user is not admin', () => {
      component.isAdmin = false;

      const items = component.visibleNavItems;

      expect(items.length).toBe(2);
      expect(items.some(item => item.id === 'dashboard')).toBeFalse();
      expect(items.some(item => item.id === 'schedule')).toBeTrue();
      expect(items.some(item => item.id === 'ai-assistant')).toBeTrue();
    });

    it('should show all items when user is admin', () => {
      component.isAdmin = true;

      const items = component.visibleNavItems;

      expect(items.length).toBe(3);
      expect(items.some(item => item.id === 'dashboard')).toBeTrue();
      expect(items.some(item => item.id === 'schedule')).toBeTrue();
      expect(items.some(item => item.id === 'ai-assistant')).toBeTrue();
    });
  });

  describe('setActiveTab', () => {
    it('should emit activeTabChange with selected tab', () => {
      spyOn(component.activeTabChange, 'emit');

      component.setActiveTab('schedule');

      expect(component.activeTabChange.emit).toHaveBeenCalledWith('schedule');
    });

    it('should emit activeTabChange multiple times', () => {
      spyOn(component.activeTabChange, 'emit');

      component.setActiveTab('schedule');
      component.setActiveTab('ai-assistant');

      expect(component.activeTabChange.emit).toHaveBeenCalledTimes(2);
      expect(component.activeTabChange.emit).toHaveBeenCalledWith('schedule');
      expect(component.activeTabChange.emit).toHaveBeenCalledWith('ai-assistant');
    });
  });

  describe('onOpenNewBooking', () => {
    it('should emit openNewBooking event', () => {
      spyOn(component.openNewBooking, 'emit');

      component.onOpenNewBooking();

      expect(component.openNewBooking.emit).toHaveBeenCalled();
    });
  });

  describe('onLogout', () => {
    it('should emit logout event', () => {
      spyOn(component.logout, 'emit');

      component.onLogout();

      expect(component.logout.emit).toHaveBeenCalled();
    });
  });
});