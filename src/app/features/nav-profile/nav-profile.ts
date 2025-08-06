import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-profile',
  imports: [],
  templateUrl: './nav-profile.html',
  styleUrl: './nav-profile.css'
})
export class NavProfile {
  constructor(private router: Router){}
   
  goToProfile():void{
      this.router.navigate(['/user-dashboard']);
    }

  }


