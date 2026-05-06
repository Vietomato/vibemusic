import { loadPlaylists } from '@angular-spotify/web/playlist/data-access';
import { PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { VisualizerStore } from '@angular-spotify/web/visualizer/data-access';
import { LyricsStore } from '@angular-spotify/web/lyrics/data-access';
// 1. THÊM AfterViewInit VÀO DÒNG NÀY:
import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

// 2. NHÉT PHÁP SƯ WHATAMESH VÀO ĐÂY:
// (Lưu ý: Nếu bị lỗi đường dẫn, hãy sửa chữ 'whatamesh' thành cái đường dẫn y hệt như bên file đăng nhập nha)
// @ts-ignore
import { Gradient } from 'whatamesh';

@Component({
  selector: 'as-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// 3. THÊM chữ "AfterViewInit" VÀO DÒNG NÀY ĐỂ BÁO CHO ANGULAR BIẾT MÌNH SẼ XÀI NÓ
export class LayoutComponent implements OnInit, AfterViewInit {
  showPiPVisualizer$ = this.visualizerStore.showPiPVisualizer$;
  showPiPLyrics$ = this.lyricsStore.showPiPLyrics$;
  lyrics$ = this.lyricsStore.lyrics$;
  activeLine$ = this.lyricsStore.activeLine$;
  isSynced$ = this.lyricsStore.isSynced$;
  currentAlbumCoverUrl$ = this.playbackStore.currentTrack$.pipe(
    map((track) => track?.album?.images[0]?.url),
    filter((imageUrl) => !!imageUrl)
  );

  constructor(
    private playbackStore: PlaybackStore,
    private store: Store,
    private visualizerStore: VisualizerStore,
    public lyricsStore: LyricsStore
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadPlaylists());
  }

  // 4. THÊM NGUYÊN CÁI HÀM NÀY VÀO CUỐI CÙNG ĐỂ KHỞI ĐỘNG NỀN UỐN ÉO:
  ngAfterViewInit(): void {
    const gradient = new Gradient();
    gradient.initGradient('#app-gradient-canvas');
  }
}