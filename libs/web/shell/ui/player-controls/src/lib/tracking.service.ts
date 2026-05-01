import { Injectable } from '@angular/core';
// Nếu có xài http thì import lại nha

@Injectable({ providedIn: 'root' })
export class TrackingService {
  
  constructor() {} 

  trackAction(actionType: 'PLAY' | 'PAUSE' | 'NEXT' | 'PREV', trackId: string) {
    // SỬA LẠI CỤC NÀY CHO KHỚP VỚI ĐÒI HỎI CỦA ÔNG PHONG:
    const payload = {
      user_id: 'user_01',        // FE cứ để tạm user_01
      track_id: trackId,
      action_type: actionType,   // Đổi action -> action_type
      played_duration_ms: 0      // Tạm thời mình cứ gửi số 0 qua cho ổng vui, sau này tính thời gian nghe thật rồi nhét vô sau
    };

    console.log('🚀 Cục data chuẩn bị bắn qua cho Phong nè:', payload);
    
    // Khi nào Phong đưa cục link (VD: http://localhost:3000/api/track) thì bà bật http.post ở đây lên là bay qua máy ổng!
  }
}