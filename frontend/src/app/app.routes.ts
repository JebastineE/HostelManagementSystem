import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentsComponent } from './pages/students/students.component';
import { HostelsComponent } from './pages/hostels/hostels.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { AllocationsComponent } from './pages/allocations/allocations.component';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Hostel Management' },
  { path: 'students', component: StudentsComponent, title: 'Students | Hostel Management' },
  { path: 'hostels', component: HostelsComponent, title: 'Hostels | Hostel Management' },
  { path: 'rooms', component: RoomsComponent, title: 'Rooms | Hostel Management' },
  { path: 'allocations', component: AllocationsComponent, title: 'Allocations | Hostel Management' },
  { path: 'activity-log', component: ActivityLogComponent, title: 'Activity Log | Hostel Management' },
  { path: 'audit', redirectTo: 'activity-log', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
