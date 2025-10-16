import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/dashboard', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'author/dashboard', loadComponent: () => import('./pages/author/author-dashboard/author-dashboard.component').then(m => m.AuthorDashboardComponent) },
  { path: 'student/dashboard', loadComponent: () => import('./pages/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
  { path: 'author/courses/create', loadComponent: () => import('./pages/create-course/create-course.component').then(m => m.CreateCourseComponent) },
  {
    path: 'student/course/:id',
    loadComponent: () =>
      import('./pages/student/course-details/course-details.component')
        .then(m => m.CourseDetailsComponent)
  },
   {
    path: 'student/enrollments',
    loadComponent: () =>
      import('./pages/student/my-enrollments/my-enrollments.component')
        .then(m => m.MyEnrollmentsComponent)
  }
];
