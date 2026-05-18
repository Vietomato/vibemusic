import { PlaybackService, PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { startWith, take } from 'rxjs/operators'; // Thêm take ở đây
import { TrackingService } from './tracking.service';

@Component({
  selector: 'as-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerControlsComponent {
  
  isPlaying$ = this.playbackStore.isPlaying$.pipe(startWith(false));

  constructor(
    private playbackStore: PlaybackStore, 
    private playbackService: PlaybackService, 
    private trackingService: TrackingService 
  ) {}

  async togglePlay() {
    // Lấy bài hát hiện tại ra bằng cách subscribe và tự hủy sau 1 lần lấy (take(1))
    this.playbackStore.currentTrack$.pipe(take(1)).subscribe(currentTrack => {
      if (currentTrack) {
        this.trackingService.trackAction('PLAY', currentTrack);
      }
    });

    this.playbackService.play(); 
  }

  async next() {
    this.playbackStore.currentTrack$.pipe(take(1)).subscribe(currentTrack => {
      if (currentTrack) {
        this.trackingService.trackAction('NEXT', currentTrack);
      }
    });

    this.playbackService.next();
  }

  async prev() {
    this.playbackStore.currentTrack$.pipe(take(1)).subscribe(currentTrack => {
      if (currentTrack) {
        this.trackingService.trackAction('PREV', currentTrack);
      }
    });

    this.playbackService.prev();
  }
}