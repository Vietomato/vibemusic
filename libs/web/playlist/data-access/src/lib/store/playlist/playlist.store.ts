import { GenericState } from '@angular-spotify/web/shared/data-access/models';
import { PlayerApiService, PlaylistApiService } from '@angular-spotify/web/shared/data-access/spotify-api';
import { PlaybackStore } from '@angular-spotify/web/shared/data-access/store';
import { RouteUtil, SelectorUtil } from '@angular-spotify/web/shared/utils';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { select, Store } from '@ngrx/store';
// SỬA LẠI ĐOẠN IMPORT NÀY:
import { combineLatest, Observable} from 'rxjs';
import { filter, map, switchMap, tap} from 'rxjs/operators'; // catchError phải nằm ở đây!
import { getPlaylistTracksById, getPlaylistTracksHasMore, getPlaylistTracksLoading, loadMorePlaylistTracks } from '../playlist-tracks';
import { getPlaylist, loadPlaylistSuccess } from '../playlists';

interface PlaylistState extends GenericState<SpotifyApi.PlaylistObjectFull> {
  playlistId: string;
}

type TogglePlaylistParams = {
  isPlaying: boolean;
};

type PlayTrackParams = {
  position: number;
};

@Injectable({ providedIn: 'root' })
export class PlaylistStore extends ComponentStore<PlaylistState> {
  playlistParams$: Observable<string> = this.route.params.pipe(
    map((params) => params.playlistId),
    filter((playlistId: string) => !!playlistId)
  );

  isCurrentPlaylistLoading$ = this.select(SelectorUtil.isLoading);
  isPlaylistTracksLoading$ = this.store.select(getPlaylistTracksLoading);

  playlist$ = this.playlistParams$.pipe(
    tap((playlistId) => {
      this.patchState({
        playlistId
      });
      this.loadPlaylist({ playlistId });
      // DÒNG QUAN TRỌNG NHẤT NÈ:
      this.loadMoreTracks(playlistId); 
    }),
    switchMap((playlistId) => this.store.pipe(select(getPlaylist(playlistId))))
  );

  tracks$ = this.playlistParams$.pipe(
    switchMap((playlistId) => this.store.pipe(select(getPlaylistTracksById(playlistId))))
  );
  tracksHasMore$ = this.playlistParams$.pipe(
    switchMap((playlistId) => this.store.pipe(select(getPlaylistTracksHasMore(playlistId))))
  );

  isPlaylistPlaying$ = SelectorUtil.getMediaPlayingState(
    combineLatest([
      this.playlist$.pipe(map((playlist) => playlist?.uri)),
      this.playbackStore.playback$
    ])
  );

  readonly loadPlaylist = this.effect<{ playlistId: string }>((params$) =>
    params$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null
        });
      }),
      switchMap(({ playlistId }) =>
        this.playlistsApi.getById(playlistId).pipe(
          tapResponse(
            (playlist) => {
              this.store.dispatch(loadPlaylistSuccess({ playlist }));
              this.patchState({
                status: 'success',
                error: null
              });
            },
            (e) => {
              console.error('Lỗi Spotify thật nè Châu ơi:', e);
              this.patchState({
                status: 'error',
                error: e as any
              });
            }
          )
        )
      )
    )
  );

  readonly togglePlaylist = this.effect<TogglePlaylistParams>((params$) =>
    params$.pipe(
      switchMap(({ isPlaying }) =>
        this.playerApi.togglePlay(isPlaying, {
          context_uri: this.playlistContextUri
        })
      )
    )
  );

  readonly playTrack = this.effect<PlayTrackParams>((params$) =>
    params$.pipe(
      switchMap(({ position }) =>
        this.playerApi.play({
          context_uri: this.playlistContextUri,
          offset: {
            position
          }
        })
      )
    )
  );

  loadMoreTracks(playlistId: string) {
    this.store.dispatch(loadMorePlaylistTracks({ playlistId }));
  }

  readonly playlistId$ = this.select((s) => s.playlistId);

  get playlistContextUri() {
    return RouteUtil.getPlaylistContextUri(this.get().playlistId);
  }

  constructor(
    private playerApi: PlayerApiService,
    private playlistsApi: PlaylistApiService,
    private route: ActivatedRoute,
    private store: Store,
    private playbackStore: PlaybackStore
  ) {
    super({
      data: null,
      error: null,
      status: 'pending',
      playlistId: ''
    });
  }
}