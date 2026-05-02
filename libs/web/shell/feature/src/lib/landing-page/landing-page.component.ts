import { Component, AfterViewInit } from '@angular/core'; // Nhớ thêm AfterViewInit
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

// Gọi pháp sư Whatamesh vào đây (thêm @ts-ignore để TypeScript khỏi bắt bẻ)
// @ts-ignore
import { Gradient } from 'whatamesh';

@Component({
  selector: 'vibe-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit {
  constructor(private router: Router) {}

  // Hàm này sẽ tự động chạy ngay sau khi cái thẻ <canvas> bên HTML được load xong
  ngAfterViewInit() {
    console.log('🚀 Bắt đầu bơm màu vô Canvas...');
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
    console.log('✅ Bơm xong! Lên sóng uốn éo!');
  }

  onLogin(event: Event) {
    event.preventDefault(); // Chặn web tải lại trang
    
    // GIẢ LẬP ĐĂNG NHẬP THÀNH CÔNG: Chuyển hướng thẳng qua trang nghe nhạc (/app)
    this.router.navigate(['/app']);
  }
}