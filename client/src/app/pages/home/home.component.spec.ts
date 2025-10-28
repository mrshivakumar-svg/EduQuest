import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    // 🔹 Create spies for dependent services
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getPublicCourses']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceMock = {
      isLoggedIn$: of(true),
      role$: of('student'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, HomeComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  // ✅ Basic creation test
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Should call API and load courses successfully
  it('should load courses successfully', () => {
    const mockResponse = {
      courses: [{ id: 1, title: 'Angular Basics' }],
      total: 6,
    };
    apiServiceSpy.getPublicCourses.and.returnValue(of(mockResponse));

    component.loadCourses(1);

    expect(apiServiceSpy.getPublicCourses).toHaveBeenCalledWith(1);
    expect(component.courses.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.totalPages).toBe(1); // 6 total / 6 per page
  });

  // ✅ Should handle API error gracefully
  it('should handle API error gracefully', () => {
    apiServiceSpy.getPublicCourses.and.returnValue(throwError(() => new Error('API Error')));

    component.loadCourses(1);

    expect(component.loading).toBeFalse();
    expect(component.courses.length).toBe(0);
  });

  // ✅ Should navigate to register
  it('should navigate to register page', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  // ✅ Should navigate to login page with redirect
  it('should navigate to login page with redirectTo param', () => {
    component.loginToViewCourse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { redirectTo: '/' } });
  });

  // ✅ Should navigate to course details
  it('should navigate to course details page', () => {
    component.viewCourseDetails(5);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/student/course', 5]);
  });

  // ✅ Pagination: should change page within valid range
  it('should change page if within range', () => {
    spyOn(window, 'scrollTo');
    component.totalPages = 3;
    apiServiceSpy.getPublicCourses.and.returnValue(of({ courses: [], total: 6 }));

    component.changePage(2);

    expect(component.currentPage).toBe(2);
    expect(apiServiceSpy.getPublicCourses).toHaveBeenCalledWith(2);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  // ✅ Pagination: should not change page if out of range
  it('should not change page if out of range', () => {
    component.totalPages = 2;
    spyOn(component, 'loadCourses');

    component.changePage(3);
    expect(component.loadCourses).not.toHaveBeenCalled();

    component.changePage(0);
    expect(component.loadCourses).not.toHaveBeenCalled();
  });

  // ✅ Pages getter should return correct number of pages
  it('should return an array of page numbers', () => {
    component.totalPages = 3;
    const pages = component.pages;
    expect(pages).toEqual([1, 2, 3]);
  });
});
