import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '@angular-spotify/web/shared/app-config';
import { SpotifyApiParams } from '@angular-spotify/web/shared/data-access/models';
import { SPOTIFY_DEFAULT_LIMIT } from './spotify-api.constant';

@Injectable({ providedIn: 'root' })
export class PlaylistApiService {
  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private http: HttpClient) {}

  getUserSavedPlaylists(
    params: SpotifyApiParams = {
      limit: SPOTIFY_DEFAULT_LIMIT
    }
  ) {
    return this.http.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
      `${this.appConfig.baseURL}/me/playlists`,
      {
        params
      }
    );
  }

getById(playlistId: string) {
  if (!playlistId) {
    throw new Error('Playlist Id is required');
  }
  // Thêm fields để ép Spotify nhả đúng cấu trúc mình cần, tránh các field rác gây 403
  const fields = 'id,name,description,images,owner,tracks(items(added_at,track(id,name,uri,duration_ms,album(name,images),artists(name))))';
  return this.http.get<SpotifyApi.PlaylistObjectFull>(
    `${this.appConfig.baseURL}/playlists/${playlistId}?fields=${fields}`
  );
}

  getTracks(playlistId: string, params: SpotifyApiParams = { limit: SPOTIFY_DEFAULT_LIMIT }) {
    if (!playlistId) {
      throw new Error('Playlist Id is required');
    }
    return this.http.get<SpotifyApi.PlaylistTrackResponse>(
      `${this.appConfig.baseURL}/playlists/${playlistId}/tracks`,
      { params }
    );
  }
}
