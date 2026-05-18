import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  
  // Link server Onrender của Phong (Đã chạy thật trên mạng)
  private readonly BASE_URL = 'https://spotify-n585.onrender.com/api'; 

  constructor() {} 

  // Đổi tham số thành currentTrack (để lấy nguyên cục thông tin bài hát)
  async trackAction(actionType: 'PLAY' | 'PAUSE' | 'NEXT' | 'PREV', currentTrack: any) {
    
    // Nếu chưa load được bài hát thì không làm gì cả
    if (!currentTrack) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.user_id || 'd9a153c2-6885-4105-aecc-bd403ed58b9e';

    // Gói dữ liệu chuẩn khớp 100% với đòi hỏi của API 1
    const payload = {
      user_id: userId,
      track_id: currentTrack.id, 
      title: currentTrack.name,
      artist: currentTrack.artists?.[0]?.name || 'Unknown Artist',
      duration_ms: currentTrack.duration_ms || 0,
      action_type: actionType, 
      played_duration_ms: 0 // Tạm thời cứ gửi 0 cho ổng vui như bạn nói 😂
    };

    console.log('🚀 Cục data CHUẨN bị bắn qua Onrender nè:', payload);
    
    try {
      // Dùng fetch bắn POST lên BE luôn, khỏi cần setup HttpClient của Angular cho lằng nhằng
      const response = await fetch(`${this.BASE_URL}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ Đã lưu thành công hành động ${actionType} vào Database của Phong!`);
      } else {
        console.error('❌ Phong từ chối nhận data. Lỗi:', await response.json());
      }
    } catch (error) {
      console.error('❌ Mất mạng hoặc Server Onrender của Phong đang ngủ hổng dậy:', error);
    }
  }
}