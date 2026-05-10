import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'as-vibe',
  templateUrl: './vibe.component.html',
  styleUrls: ['./vibe.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VibeComponent {
  // Bộ màu mặc định hường phấn dịu dàng của bồ đây
  initialColors = ['#FFE4E1', '#FFF0F5', '#F8BBD0', '#FFFFFF'];
  
  // Khởi tạo màu hiện tại bằng màu mặc định
  themeColors = [...this.initialColors];

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
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
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
  }

  // NÚT RESET: Trả lại sự bình yên hường phấn cho giao diện
  resetVibe() {
    // 1. Reset 4 ô màu trên màn hình về bộ màu hồng
    this.themeColors = [...this.initialColors];

    // 2. Ép cái web quay về dải gradient hồng tĩnh (không chuyển động)
    const styleId = 'vibe-magic-global-style';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Ghi đè lại style: bỏ animation, dùng mảng initialColors
    styleEl.innerHTML = `
      body, html, as-layout, .main-view, .app-shell, .layout-container {
        background: linear-gradient(135deg, ${this.initialColors[0]}, ${this.initialColors[1]}, ${this.initialColors[2]}, ${this.initialColors[3]}) !important;
        background-size: 100% 100% !important; /* Dàn đều, không phóng to */
        animation: none !important; /* Tắt chuyển động */
      }
    `;
  }
}