import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginScreenComponent } from './login-screen.component';

describe('LoginScreenComponent', () => {
    let component: LoginScreenComponent;
    let fixture: ComponentFixture<LoginScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginScreenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onLogin EventEmitter', () => {
        it('should emit true when loginAsAdmin is called', (done) => {
            component.onLogin.subscribe((isAdmin) => {
                expect(isAdmin).toBe(true);
                done();
            });

            component.loginAsAdmin();
        });

        it('should emit false when loginAsClient is called', (done) => {
            component.onLogin.subscribe((isAdmin) => {
                expect(isAdmin).toBe(false);
                done();
            });

            component.loginAsClient();
        });
    });

    describe('loginAsAdmin', () => {
        it('should call onLogin.emit with true', () => {
            spyOn(component.onLogin, 'emit');

            component.loginAsAdmin();

            expect(component.onLogin.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('loginAsClient', () => {
        it('should call onLogin.emit with false', () => {
            spyOn(component.onLogin, 'emit');

            component.loginAsClient();

            expect(component.onLogin.emit).toHaveBeenCalledWith(false);
        });
    });

    describe('Multiple login attempts', () => {
        it('should handle multiple admin logins', () => {
            spyOn(component.onLogin, 'emit');

            component.loginAsAdmin();
            component.loginAsAdmin();

            expect(component.onLogin.emit).toHaveBeenCalledTimes(2);
            expect(component.onLogin.emit).toHaveBeenCalledWith(true);
        });

        it('should handle multiple client logins', () => {
            spyOn(component.onLogin, 'emit');

            component.loginAsClient();
            component.loginAsClient();

            expect(component.onLogin.emit).toHaveBeenCalledTimes(2);
            expect(component.onLogin.emit).toHaveBeenCalledWith(false);
        });

        it('should handle alternating login attempts', () => {
            spyOn(component.onLogin, 'emit');

            component.loginAsAdmin();
            component.loginAsClient();
            component.loginAsAdmin();

            expect(component.onLogin.emit).toHaveBeenCalledTimes(3);
            const calls = (component.onLogin.emit as jasmine.Spy).calls.allArgs();
            expect(calls[0][0]).toBe(true);
            expect(calls[1][0]).toBe(false);
            expect(calls[2][0]).toBe(true);
        });
    });
});
