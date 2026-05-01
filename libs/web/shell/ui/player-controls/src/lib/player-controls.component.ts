import { PlaybackService, PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { TrackingService } from './tracking.service';

@Component({
  selector: 'as-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerControlsComponent {
  isPlaying$ = this.playbackStore.isPlaying$.pipe(startWith(false));
  
  constructor(private playbackStore: PlaybackStore, private playbackService: PlaybackService) {
  }

  async togglePlay() {// TODO: (CHÂU) - Nhóm mình sẽ chèn code gọi API đẩy dữ liệu về Backend của Phong tại đây!
    this.playbackService.play();// TODO: (CHÂU) - Nhóm mình sẽ chèn code gọi API đẩy dữ liệu về Backend của Phong tại đây!
  }

  async next() {
    this.playbackService.next();
  }

  async prev() {
    this.playbackService.prev();
  }

  trackingService = inject(TrackingService);
}
