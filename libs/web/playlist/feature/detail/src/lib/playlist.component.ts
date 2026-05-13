import { PlaylistStore } from '@angular-spotify/web/playlist/data-access';
import { RouteUtil } from '@angular-spotify/web/shared/utils';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'as-playlist',
  templateUrl: './playlist.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  providers: [PlaylistStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent {
  // Những biến này dùng dấu $ ở cuối để báo hiệu đây là Observable (luồng dữ liệu)
  playlistId$ = this.store.playlistId$;
  playlist$ = this.store.playlist$;
  isPlaylistPlaying$ = this.store.isPlaylistPlaying$;
  isCurrentPlaylistLoading$ = this.store.isCurrentPlaylistLoading$;
  
  // Biến này cực quan trọng nè Châu, nó sẽ hứng dữ liệu từ cái Store bà vừa sửa
  tracks$ = this.store.tracks$; 
  
  isPlaylistTracksLoading$ = this.store.isPlaylistTracksLoading$;
  tracksHasMore$ = this.store.tracksHasMore$;

  constructor(private store: PlaylistStore) {}

  togglePlaylist(isPlaying: boolean) {
    this.store.togglePlaylist({
      isPlaying
    });
  }

  playTrack(position: number) {
    this.store.playTrack({
      position
    });
  }

  loadMoreTracks() {
    this.store.playlistId$.pipe(take(1)).subscribe((playlistId: string) => {
      if (playlistId) {
        this.store.loadMoreTracks(playlistId);
      }
    });
  }

  getPlaylistContextUri(playlistId: string | null) {
    // Hàm này giúp lấy link playlist để Spotify biết đang phát ở đâu
    return RouteUtil.getPlaylistContextUri(playlistId || '');
  }
}