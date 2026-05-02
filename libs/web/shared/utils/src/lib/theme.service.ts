import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes = {
    purple: ['#110e20', '#3a1c61', '#190c3a', '#000000'], // Tím ma mị (Mặc định)
    ocean: ['#000022', '#004488', '#002244', '#001122'],  // Xanh đại dương
    forest: ['#001a00', '#004d00', '#003300', '#000d00'], // Xanh lá rừng
    fire: ['#330000', '#800000', '#4d0000', '#1a0000'],   // Đỏ dung nham
  };

  constructor() {
    this.loadSavedTheme();
  }

  setTheme(themeName: 'purple' | 'ocean' | 'forest' | 'fire') {
    const colors = this.themes[themeName];
    document.documentElement.style.setProperty('--theme-color-1', colors[0]);
    document.documentElement.style.setProperty('--theme-color-2', colors[1]);
    document.documentElement.style.setProperty('--theme-color-3', colors[2]);
    document.documentElement.style.setProperty('--theme-color-4', colors[3]);
    
    localStorage.setItem('user-vibe-theme', themeName);
  }

  private loadSavedTheme() {
    const savedTheme = localStorage.getItem('user-vibe-theme') as keyof typeof this.themes;
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
    }
  }
}