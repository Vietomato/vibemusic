import { PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'as-now-playing-bar',
  templateUrl: './now-playing-bar.component.html',
  styleUrls: ['./now-playing-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingBarComponent {
  currentTrack$ = this.playbackStore.currentTrack$;
  
  showFullscreenPlayer = false;
  playerBackground = 'linear-gradient(135deg, #333 0%, #000 100%)';
  currentTrackDetails: any = null;
  playbackState$ = (this.playbackStore as any).playback$;

  constructor(
    private playbackStore: PlaybackStore,
    private cdr: ChangeDetectorRef
  ) {}

  toggleFullscreenPlayer(track: any) {
    if (!track) {
      this.showFullscreenPlayer = false;
    } else {
      this.showFullscreenPlayer = !this.showFullscreenPlayer;
      this.currentTrackDetails = track;

      if (this.showFullscreenPlayer && track.album?.images?.[0]?.url) {
        // Dùng code tự trồng để lấy màu, bỏ qua thư viện lỗi!
        this.extractAverageColor(track.album.images[0].url);
      }
    }
    this.cdr.detectChanges();
  } 

  dynamicTextColor = '#ffffff';
  // TUYỆT CHIÊU LẤY MÀU BẰNG CANVAS (Không cần cài đặt thêm bất cứ gì)
  extractAverageColor(imageUrl: string) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Tạo nền Gradient
      const color1 = `rgba(${r}, ${g}, ${b}, 0.8)`;
      const color2 = `rgba(${Math.max(0, r - 120)}, ${Math.max(0, g - 120)}, ${Math.max(0, b - 120)}, 1)`;
      this.playerBackground = `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;

      // -------------------------------------------------------------
      // TUYỆT CHIÊU: Tính độ sáng (Luminance) để chọn màu chữ
      // -------------------------------------------------------------
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      if (luminance > 128) {
        // Nền SÁNG -> Chữ & Nút ĐEN
        this.dynamicTextColor = 'rgba(0, 0, 0, 0.85)'; 
      } else {
        // Nền TỐI -> Chữ & Nút TRẮNG
        this.dynamicTextColor = 'rgba(255, 255, 255, 0.85)'; 
      }
      
      this.cdr.detectChanges();
    };
  }
}