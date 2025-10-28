import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthorProfileComponent } from './author-profile.component';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

// ✅ Mock ApiService (no real HTTP calls)
class MockApiService {
  getAuthorProfile() {
    return of({
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-05-01T00:00:00Z',
      courses: [],
    });
  }
}

// ✅ Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

fdescribe('AuthorProfileComponent', () => {
  let component: AuthorProfileComponent;
  let fixture: ComponentFixture<AuthorProfileComponent>;
  let apiService: MockApiService;
  let router: MockRouter;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthorProfileComponent,
        CommonModule,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: Router, useClass: MockRouter }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorProfileComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as unknown as MockApiService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  // ✅ 1. Component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. Should load author profile successfully
  it('should load author profile on init', waitForAsync(() => {
    spyOn(apiService, 'getAuthorProfile').and.returnValue(of({
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: '2023-12-01T00:00:00Z',
      courses: []
    }));

    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(apiService.getAuthorProfile).toHaveBeenCalled();
      expect(component.author?.name).toBe('Jane Doe');
      expect(component.loading).toBeFalse();
    });
  }));

  // ✅ 3. Should handle API error gracefully
  it('should handle API error gracefully', waitForAsync(() => {
    spyOn(apiService, 'getAuthorProfile').and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(apiService.getAuthorProfile).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(component.author?.name).toBe('Fallback Author');
    });
  }));

  // ✅ 4. Should toggle edit mode
  it('should toggle edit mode', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  // ✅ 5. Should cancel edit mode
  it('should cancel edit mode', () => {
    component.isEditing = true;
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
  });

  // ✅ 6. Should save profile
  it('should save profile and disable edit mode', () => {
    component.isEditing = true;
    component.saveProfile();
    expect(component.isEditing).toBeFalse();
  });

  // ✅ 7. Should return initials
  it('should return correct initials', () => {
    expect(component.getInitial('John Doe')).toBe('JD');
    expect(component.getInitial('Alice')).toBe('A');
  });

  // ✅ 8. Should assign color class
  it('should return color class based on name', () => {
    const result = component.getAvatarColorClass('John');
    expect(result).toMatch(/^avatar-bg-[1-5]$/);
  });

  // ✅ 9. Should navigate back to dashboard
  it('should navigate back to author dashboard', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/author/dashboard']);
  });
});
