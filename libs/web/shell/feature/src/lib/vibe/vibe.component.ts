import { Component, OnInit } from '@angular/core'; // THÊM OnInit
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // THÊM súng ống gọi API

@Component({
  selector: 'as-vibe',
  templateUrl: './vibe.component.html',
  styleUrls: ['./vibe.component.scss'],
  standalone: true,
  imports: [CommonModule] // Nếu Angular báo lỗi thiếu HTTP thì bà đổi thành [CommonModule, HttpClientModule] nha
})
export class VibeComponent implements OnInit {
  // Bộ màu mặc định
  initialColors = ['#FFE4E1', '#FFF0F5', '#F8BBD0', '#FFFFFF'];
  
  // Khởi tạo màu hiện tại
  themeColors = [...this.initialColors];

  // 1. Thuê thằng shipper HttpClient vào
  constructor(private http: HttpClient) {}

  // 2. KHI VỪA MỞ COMPONENT LÊN -> TẢI MÀU TỪ DB XUỐNG ĐẮP VÀO LIỀN
  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.user_id) {
      // (Lưu ý: Check lại link API này cho khớp với link bên file layout nha sếp)
      this.http.get(`https://spotify-n585.onrender.com/api/ui-settings/${currentUser.user_id}`).subscribe({
        next: (res: any) => {
          // Nếu DB có lưu màu trước đó thì lấy ra xài
          if (res && res.data && res.data.settings && res.data.settings.themeColors) {
            this.themeColors = res.data.settings.themeColors;
            this.applyVibe(); // Tải về xong tự động bơm màu lên web luôn!
          }
        },
        error: (err) => console.log('Chưa có màu lưu hoặc lỗi lấy DB:', err)
      });
    }
  }

  onColorChange(index: number, event: any) {
    this.themeColors[index] = event.target.value;
  }

  randomize() {
    this.themeColors = this.themeColors.map(() => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    });
  }

  applyVibe() {
    const styleId = 'vibe-magic-global-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style') as HTMLStyleElement;
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      @keyframes vibeFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 50% 50%; }
        100% { background-position: 0% 50%; }
      }

      body, html, as-layout, .main-view, .app-shell, .layout-container {
        background: linear-gradient(135deg, ${this.themeColors[0]}, ${this.themeColors[1]}, ${this.themeColors[2]}, ${this.themeColors[3]}) !important;
        background-size: 120% 120% !important;
        background-attachment: fixed !important;
        animation: vibeFlow 20s ease infinite !important;
      }
    `;

    // 3. ĐÃ BẤM "ÁP DỤNG" LÀ PHẢI LƯU NGAY XUỐNG DB
    this.saveThemeToDB(this.themeColors);
  }

  resetVibe() {
    this.themeColors = [...this.initialColors];

    const styleId = 'vibe-magic-global-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style') as HTMLStyleElement;
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      body, html, as-layout, .main-view, .app-shell, .layout-container {
        background: linear-gradient(135deg, ${this.initialColors[0]}, ${this.initialColors[1]}, ${this.initialColors[2]}, ${this.initialColors[3]}) !important;
        background-size: 100% 100% !important;
        animation: none !important;
      }
    `;

    // LƯU LẠI MÀU MẶC ĐỊNH VÀO DB (Xóa màu cũ)
    this.saveThemeToDB(this.initialColors);
  }

  // 4. TUYỆT CHIÊU LƯU MÀU MÀ KHÔNG LÀM ĐÈ MẤT STICKER
  saveThemeToDB(colors: string[]) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || !currentUser.user_id) return;

    // BƯỚC A: Móc lên DB xin cục sticker cũ về (để không bị đè mất)
    this.http.get(`https://spotify-n585.onrender.com/api/ui-settings/${currentUser.user_id}`).subscribe({
      next: (res: any) => {
        
        // Rút cục sticker cũ ra
        let currentStickers = {};
        if (res && res.sticker_coordinates) {
          currentStickers = res.sticker_coordinates; 
        } else if (res && res.data && res.data.sticker_coordinates) {
          currentStickers = res.data.sticker_coordinates;
        }

        // BƯỚC B: Gộp sticker cũ + màu mới theo ĐÚNG CHUẨN JSON CỦA PHONG
        const payload = {
          user_id: currentUser.user_id,
          sticker_coordinates: currentStickers, // Đổ đống sticker cũ ra lại
          theme_colors: colors                  // SỬA CHỖ NÀY: Dùng đúng chữ theme_colors
        };

        // BƯỚC C: Giao cho shipper POST lên DB
        this.http.post('https://spotify-n585.onrender.com/api/ui-settings', payload).subscribe({
          next: () => console.log('🎉 Đã lưu theme màu vào Database thành công!'),
          error: (err) => console.error('❌ Lỗi lưu theme:', err)
        });
      }
    });
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}