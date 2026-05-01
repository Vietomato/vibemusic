import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private http = inject(HttpClient);
  // Link API của Phong, khi nào có thì đổi sau
  private API_URL = 'http://localhost:3000/api/track'; 

  trackAction(actionType: 'PLAY' | 'PAUSE' | 'NEXT' | 'PREV', trackId: string) {
    const payload = {
      action: actionType,
      track_id: trackId,
      timestamp: new Date().toISOString(),
      user_id: 'user_01' // Tạm thời để vậy
    };

    // In ra màn hình console để bà test trước khi có Backend
    console.log('🚀 Đã bắt được sự kiện:', payload);
    
    // Khi nào Phong làm xong API thì bỏ dấu // ở dòng dưới đi:
    // return this.http.post(this.API_URL, payload).subscribe();
  }
}