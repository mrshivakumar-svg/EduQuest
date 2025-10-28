import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['loginUser']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]), // ✅ use withRoutes([]) for RouterLink & RouterLinkActive
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ✅ Basic creation test
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
  });

  it('should show message if email or password is missing', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    expect(component.message).toBe('Please enter both email and password.');
  });

  it('should call login API and navigate student on success', () => {
    const mockResponse = { token: 'abc123', user: { role: 'student' } };
    apiServiceSpy.loginUser.and.returnValue(of(mockResponse));
    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onLogin();
    expect(apiServiceSpy.loginUser).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledWith('abc123', 'student');
  });

  it('should show "No account found" message on 404 error', () => {
    apiServiceSpy.loginUser.and.returnValue(throwError(() => ({ status: 404 })));
    component.loginForm.setValue({ email: 'x@x.com', password: '123' });
    component.onLogin();
    expect(component.message).toBe('No account found with this email.');
  });

  it('should show "Incorrect password" message on 400 error', () => {
    apiServiceSpy.loginUser.and.returnValue(throwError(() => ({ status: 400 })));
    component.loginForm.setValue({ email: 'x@x.com', password: 'wrong' });
    component.onLogin();
    expect(component.message).toBe('Incorrect password. Please try again.');
  });

  it('should show generic message on 500 error', () => {
    apiServiceSpy.loginUser.and.returnValue(throwError(() => ({ status: 500 })));
    component.loginForm.setValue({ email: 'z@z.com', password: 'err' });
    component.onLogin();
    expect(component.message).toBe('Login failed. Please try again later.');
  });
});
