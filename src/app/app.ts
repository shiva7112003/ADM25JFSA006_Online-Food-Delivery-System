import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileEdit } from './features/profile/profile-edit/profile-edit';
import { UserDashboard } from './features/dashboard/user-dashboard/user-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('caseStudy');
}
