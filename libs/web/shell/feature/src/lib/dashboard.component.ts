import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <iframe 
      [src]="dashboardUrl"
      style="width:100%; height:100%; border:none; display:block;"
      scrolling="auto">
    </iframe>
  `,
  styles: [`
    /* Đổi overflow-y: auto thành overflow: hidden để triệt tiêu thanh cuộn thừa */
    :host { display: block; height: calc(100vh - 80px); overflow: hidden; }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/dashboard.html');

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const userId   = localStorage.getItem('vibe_user_id');
    const username = localStorage.getItem('vibe_username');

    let url = '/assets/dashboard.html';
    if (userId)        url += `?userId=${userId}`;
    else if (username) url += `?username=${username}`;

    this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}