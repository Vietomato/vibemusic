import { PlaybackService, PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { ChangeDetectionStrategy, Component } from '@angular/core'; // Tui đã xóa chữ inject ở đây cho sạch
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

  constructor(
    private playbackStore: PlaybackStore, 
    private playbackService: PlaybackService, 
    private trackingService: TrackingService // Đã nhét vào constructor thành công!
  ) {}

  async togglePlay() {
    // Tạm thời mình cứ bắn sự kiện PLAY để test luồng trước cho khỏi rắc rối nha
    this.trackingService.trackAction('PLAY', 'id_bai_hat_tam_thoi');
    this.playbackService.play(); 
  }

  async next() {
    this.trackingService.trackAction('NEXT', 'id_bai_hat_tam_thoi');
    this.playbackService.next();
  }

  async prev() {
    this.trackingService.trackAction('PREV', 'id_bai_hat_tam_thoi');
    this.playbackService.prev();
  }
}