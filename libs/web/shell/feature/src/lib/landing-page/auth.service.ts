import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Địa chỉ nhà ông Phong Backend
  private apiUrl = 'http://localhost:3000'; 

  // Kêu xe HttpClient của Angular ra để chở dữ liệu đi
  constructor(private http: HttpClient) {}

  // Lệnh bắt đầu đi giao hàng (nhận vào username và pass)
  login(user: string, pass: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      username: user,
      password: pass
    });
  }
}