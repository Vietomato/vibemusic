import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  
  constructor() {} // Xóa http đi tạm thời

  trackAction(actionType: 'PLAY' | 'PAUSE' | 'NEXT' | 'PREV', trackId: string) {
    const payload = {
      action: actionType,
      track_id: trackId,
      timestamp: new Date().toISOString(),
      user_id: 'user_01'
    };

    console.log('🚀 Đã bắt được sự kiện:', payload);
  }
}