import { HttpClient } from '@angular/common/http';
import { loadPlaylists } from '@angular-spotify/web/playlist/data-access';
import { PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { VisualizerStore } from '@angular-spotify/web/visualizer/data-access';
import { LyricsStore } from '@angular-spotify/web/lyrics/data-access';
import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// @ts-ignore
import { Gradient } from 'whatamesh';

@Component({
  selector: 'as-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // 1. KHAI BÁO BIẾN (Tui đã cập nhật API Key thật của bà vào đây luôn)
  currentUrl: string = '';
  stickersByRoute: { [url: string]: any[] } = {}; 
  stickers: any[] = [];
  showStickerPicker = false;
  apiKey = 'NvjMKgupsz0ZkV5HoTqopDchkAhewP0p'; 

  get addedStickers(): any[] {
    return this.stickersByRoute[this.currentUrl] || [];
  }

  showPiPVisualizer$ = this.visualizerStore.showPiPVisualizer$;
  showPiPLyrics$ = this.lyricsStore.showPiPLyrics$;
  lyrics$ = this.lyricsStore.lyrics$;
  activeLine$ = this.lyricsStore.activeLine$;
  isSynced$ = this.lyricsStore.isSynced$;
  currentAlbumCoverUrl$ = this.playbackStore.currentTrack$.pipe(
    map((track) => track?.album?.images[0]?.url),
    filter((imageUrl) => !!imageUrl)
  );

  // THÊM BIẾN NÀY VÀO NGAY TRÊN CHỮ CONSTRUCTOR NHA:
  isLoadedDB = false;

  constructor(
    private playbackStore: PlaybackStore,
    private store: Store,
    private visualizerStore: VisualizerStore,
    public lyricsStore: LyricsStore,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects;
      
      // KIỂM TRA: CHỈ GỌI XUỐNG DB ĐÚNG 1 LẦN LÚC MỚI MỞ WEB
      if (!this.isLoadedDB) {
        this.initUserAndLoadStickers();
        this.isLoadedDB = true; // Cắm cờ đã load xong
      } else {
        // Mấy lần sau chuyển tab, chỉ cần kêu Angular vẽ lại UI thôi, không gọi DB nữa!
        this.cdr.detectChanges();
      }
    });
  }
  ngOnInit(): void {
    this.store.dispatch(loadPlaylists());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvasEl = document.querySelector('#app-gradient-canvas');
      if (canvasEl) {
        const gradient = new Gradient();
        gradient.initGradient('#app-gradient-canvas');
      }
    }, 500);
  }

  // ==========================================
  // KHU VỰC 2: CÁC HÀM GỌI API LẤY GIPHY
  // ==========================================
  async loadStickers() {
    this.showStickerPicker = !this.showStickerPicker;
    if (this.showStickerPicker && this.stickers.length === 0) {
      this.fetchGiphy(`https://api.giphy.com/v1/stickers/trending?api_key=${this.apiKey}&limit=21`);
    }
  }

  async searchStickers(query: string) {
    if (!query.trim()) {
      this.fetchGiphy(`https://api.giphy.com/v1/stickers/trending?api_key=${this.apiKey}&limit=21`);
      return;
    }
    this.fetchGiphy(`https://api.giphy.com/v1/stickers/search?api_key=${this.apiKey}&q=${query}&limit=21`);
  }

  async fetchGiphy(url: string) {
    try {
      const response = await fetch(url);
      const result = await response.json();
      this.stickers = result.data; 
    } catch (error) {
      console.error('Lỗi lấy Giphy:', error);
    }
  }

  // ==========================================
  // KHU VỰC 3: CÁC HÀM THAO TÁC UI VÀ LƯU DATABASE
  // ==========================================
  saveStickersToDB() {
    const allStickersData = JSON.stringify(this.stickersByRoute);
    const userId = localStorage.getItem('user_id'); // Rút ID đã lưu ra xài

    if (!userId) return; // Rào chắn an toàn

    const payload = {
      user_id: userId,
      sticker_coordinates: allStickersData 
    };

    const apiUrl = 'https://spotify-n585.onrender.com/api/ui-settings'; 

    this.http.post(apiUrl, payload).subscribe({
      next: (res) => console.log('✅ Đã lưu xuống DB thành công cho user:', userId),
      error: (err) => console.error('❌ Lỗi khi lưu DB:', err)
    });
  }

  // 1. HÀM TỰ ĐỘNG LẤY USER ID TỪ SPOTIFY (NẾU CHƯA CÓ)
  async initUserAndLoadStickers() {
    // Ép cứng một ID giả định để test luồng Sticker (Bypass lỗi Token của team)
    let userId = 'd9a153c2-6885-4105-aecc-bd403ed58b9e'; 
    
    localStorage.setItem('user_id', userId);

    /* 🚨 ĐÃ COMMENT ĐOẠN GỌI SPOTIFY VÌ TOKEN CỦA TEAM ĐANG BỊ LỖI
    if (!userId) {
      const token = localStorage.getItem('AS-access_token');
      if (token) {
        try {
          const res = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          // ...
        } catch (error) {
          console.error('Không lấy được profile Spotify:', error);
        }
      }
    }
    */

    // Có ID giả rồi thì gọi API của Phong luôn, không cần đợi Spotify nữa!
    if (userId) {
      console.log('Đã có user_id (Bypass mode):', userId);
      this.loadStickersFromDB(userId);
    } else {
      console.error('Vẫn không có user_id!');
    }
  }

  // 2. HÀM GỌI API CỦA PHONG (Đã nhận ID)
  // HÀM GỌI API CỦA PHONG (Đã khớp toàn bộ luồng)
  loadStickersFromDB(userId: string) {
    const apiUrl = `https://spotify-n585.onrender.com/api/ui-settings/${userId}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        if (res && res.sticker_coordinates) {
          try {
            let data = res.sticker_coordinates;
            
            // TUYỆT CHIÊU: Nếu Phong trả về mảng [], ép nó thành Object {}
            if (Array.isArray(data) && data.length === 0) {
              this.stickersByRoute = {};
            } else {
              this.stickersByRoute = data; 
            }
            
            this.cdr.detectChanges(); 
          } catch (e) {
            console.error('Lỗi gán data:', e);
          }
        }
      },
      error: (err) => console.error('Lỗi khi lấy data từ DB:', err)
    });
  }
  // Hàm 4: Dán sticker ra màn hình (Đã fix lỗi undefined)
  // HÀM DÁN STICKER ĐÃ FIX LỖI ONPUSH
  addStickerToScreen(sticker: any) {
    if (!this.stickersByRoute[this.currentUrl]) {
      this.stickersByRoute[this.currentUrl] = [];
    }

    // TUYỆT CHIÊU: Dùng Spread Operator (...) để tạo mảng mới toanh, ép Angular vẽ lại!
    this.stickersByRoute[this.currentUrl] = [
      ...this.stickersByRoute[this.currentUrl],
      {
        url: sticker.images.fixed_height.url,
        x: 200, 
        y: 150  
      }
    ];

    this.showStickerPicker = false;
    this.saveStickersToDB(); 
    this.cdr.detectChanges(); 
  }

  // SỬA LUÔN HÀM XÓA ĐỂ KHÔNG BỊ KẸT
  removeSticker(index: number) {
    // Tạo mảng mới -> Xóa -> Gán lại
    const newArray = [...this.stickersByRoute[this.currentUrl]];
    newArray.splice(index, 1);
    this.stickersByRoute[this.currentUrl] = newArray;
    
    this.saveStickersToDB();
    this.cdr.detectChanges();
  }

  onDragEnded(event: any, index: number) {
    const newPosition = event.source.getFreeDragPosition();
    this.stickersByRoute[this.currentUrl][index].x = newPosition.x;
    this.stickersByRoute[this.currentUrl][index].y = newPosition.y;
    this.saveStickersToDB(); // Kéo thả xong tự lưu API
    this.cdr.detectChanges();
  }
}