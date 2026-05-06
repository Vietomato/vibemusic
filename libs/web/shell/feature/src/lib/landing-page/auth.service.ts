import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. DÁN CÁI LINK MỚI ÔNG PHONG GỬI VÀO ĐÂY 👇 (Nhớ bỏ dấu / ở cuối link nha)
  // Ví dụ ổng gửi: https://vibe-music-api.onrender.com
  private apiUrl = 'https://spotify-n585.onrender.com'; // <--- Thay cái cục trong ngoặc nháy này

  constructor(private http: HttpClient) {}

  // 2. GẮN THÊM CHỮ /api VÔ ĐƯỜNG DẪN 👇
  login(user: string, pass: string) {
    return this.http.post(`${this.apiUrl}/api/login`, {
      username: user,
      password: pass
    });
  }

  // TIỆN TAY LÀM LUÔN CÁI ĐĂNG KÝ CHO MỐT XÀI 👇
  register(user: string, pass: string) {
    return this.http.post(`${this.apiUrl}/api/register`, {
      username: user,
      password: pass
    });
  }
}