import { Component, AfterViewInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from './auth.service'; 

// Gọi pháp sư Whatamesh vào đây
// @ts-ignore
import { Gradient } from 'whatamesh';

@Component({
  selector: 'vibe-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit {
  // Biến lưu dữ liệu Form
  username = '';
  password = '';
  
  // Công tắc: Mặc định là true (đang ở giao diện Đăng Nhập)
  isLoginMode = true; 

  // Gọi Router và Shipper vào
  constructor(private router: Router, private authService: AuthService) {}

  // Hàm lật qua lật lại giữa Đăng nhập / Đăng ký
  toggleMode() {
    this.isLoginMode = !this.isLoginMode; 
    // Reset lại ô nhập cho sạch sẽ khi đổi chế độ
    this.username = '';
    this.password = '';
  }

  // Hàm bơm màu nền
  ngAfterViewInit() {
    console.log('🚀 Bắt đầu bơm màu vô Canvas...');
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
    console.log('✅ Bơm xong! Lên sóng uốn éo!');
  }

  // Hàm xử lý khi bấm nút submit Form (nút duy nhất)
  onLogin(event: Event) {
    event.preventDefault(); // Chặn web tải lại trang
    
    if (this.isLoginMode) {
      // --- XỬ LÝ ĐĂNG NHẬP ---
      console.log('Đang gửi API đăng nhập...', this.username, this.password);

      this.authService.login(this.username, this.password).subscribe({
        next: (response: any) => {
          console.log('🎉 Backend báo OK, đăng nhập thành công:', response);

          // 1. Lưu tên cho Dashboard hiển thị
          localStorage.setItem('vibe_username', this.username);

          // 2. LƯU THÊM MÃ ID THẬT ĐỂ ĐỒNG BỘ LUỒNG NGHE NHẠC
          // Lấy ID do Database của Phong trả về nhét vào kho cho TrackingService xài
          if (response && response.data && response.data.user_id) {
            const userToSave = {
              user_id: response.data.user_id,
              username: this.username
            };
            localStorage.setItem('currentUser', JSON.stringify(userToSave));
            console.log('🎯 Đã đồng bộ ID nghe nhạc thành công!');
          }

          this.router.navigate(['/app']); // Mở cửa vô web
        },
        error: (err) => {
          console.error('❌ Đăng nhập thất bại:', err);
          alert('Sai tên đăng nhập hoặc mật khẩu rồi kìa!'); 
        }
      });
    } else {
      // --- XỬ LÝ ĐĂNG KÝ THẬT ---
      console.log('Đang gửi API đăng ký...', this.username, this.password);
      
      // Gọi Shipper đi giao hàng cho ông Phong
      this.authService.register(this.username, this.password).subscribe({
        next: (response: any) => {
          console.log('🎉 Tạo tài khoản thành công trên Database:', response);
          alert('Tạo tài khoản thành công! Bây giờ hãy đăng nhập nha.');
          this.toggleMode(); // Lật về form Đăng Nhập
        },
        error: (err) => {
          console.error('❌ Đăng ký thất bại:', err);
          alert('Lỗi rồi! Có thể trùng tên đăng nhập hoặc Backend chưa chạy!'); 
        }
      });
    }
  }
  }