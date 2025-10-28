import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ApiService } from '../../../services/api.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

fdescribe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockProfile = {
    name: 'Alice',
    email: 'alice@example.com',
    avatarUrl: 'avatar.png'
  };

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getProfile', 'getMyEnrollments']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ProfileComponent // ✅ FIXED: standalone component must be imported, not declared
      ],
      providers: [{ provide: ApiService, useValue: apiSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch profile data on init', () => {
    apiService.getProfile.and.returnValue(of(mockProfile));
    apiService.getMyEnrollments.and.returnValue(of({ total: 3 }));

    component.ngOnInit();

    expect(apiService.getProfile).toHaveBeenCalled();
    expect(apiService.getMyEnrollments).toHaveBeenCalled();
  });

  it('should handle profile fetch error gracefully', () => {
    apiService.getProfile.and.returnValue(throwError(() => new Error('Error')));
    apiService.getMyEnrollments.and.returnValue(of({ total: 0 }));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
  });

  it('should toggle edit mode', () => {
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
  });

  it('should cancel edit and reset profile', () => {
    component.originalProfile = { name: 'Alice', email: 'alice@example.com', avatarUrl: 'avatar.png' };
    component.profile = { name: 'Bob', email: 'bob@example.com', avatarUrl: 'new.png' };
    component.profileImageUrl = 'fakeurl';
    component.selectedFile = new File([''], 'dummy.png');

    component.cancelEdit();

    expect(component.isEditing).toBeFalse();
    expect(component.profile.name).toBe('Alice');
    expect(component.profileImageUrl).toBeNull();
    expect(component.selectedFile).toBeNull();
  });

  it('should save profile and reset editing state', () => {
    component.profile = { name: 'Alice', email: 'alice@example.com', avatarUrl: 'avatar.png' };
    component.selectedFile = new File([''], 'image.png');
    component.profileImageUrl = 'data:image/png;base64,xyz';

    component.saveProfile();

    expect(component.isEditing).toBeFalse();
    expect(component.selectedFile).toBeNull();
  });

  it('should trigger file input click', () => {
    const mockFileInput = { nativeElement: { click: jasmine.createSpy('click') } };
    component.fileInput = mockFileInput as any;
    component.triggerFileInput();

    expect(mockFileInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle file selection and read as DataURL', () => {
    const mockFile = new File(['dummy'], 'test.png', { type: 'image/png' });
    const mockReader: any = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onload: null
    };
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    const event = {
      target: { files: [mockFile] }
    } as unknown as Event;

    component.onFileSelected(event);

    // simulate FileReader.onload callback
    mockReader.onload!({ target: { result: 'data:image/png;base64,xyz' } } as any);

    expect(component.profileImageUrl).toBe('data:image/png;base64,xyz');
  });

  it('should return correct avatar initial', () => {
    expect(component.getInitial('Alice')).toBe('A');
    expect(component.getInitial('')).toBe('?');
  });

  it('should return consistent avatar color class', () => {
    const class1 = component.getAvatarColorClass('Alice');
    const class2 = component.getAvatarColorClass('Bob');
    expect(class1).toContain('avatar-bg-');
    expect(class2).toContain('avatar-bg-');
  });
});
