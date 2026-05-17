import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <iframe 
      src="/assets/dashboard.html" 
      style="width:100%;height:100vh;border:none;">
    </iframe>
  `
})
export class DashboardComponent {}