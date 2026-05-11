import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@angular-spotify/web/shared/app-config';
import { SpotifyApiParams } from '@angular-spotify/web/shared/data-access/models';
import { SPOTIFY_DEFAULT_LIMIT } from './spotify-api.constant';

export type SearchResponse = Pick<
  SpotifyApi.SearchResponse,
  'tracks' | 'artists' | 'albums' | 'playlists'
>;

@Injectable({ providedIn: 'root' })
export class SearchApiService {
  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private http: HttpClient) {}

  /**
   * Search for tracks, artists, albums, and playlists
   *
   * @param {string} term
   * @param {SpotifyApiParams} [apiParams={ limit: SPOTIFY_DEFAULT_LIMIT }]
   * @return {*}  {(Observable<SearchResponse>)}
   */
  search(
    term: string,
    apiParams: SpotifyApiParams = { limit: SPOTIFY_DEFAULT_LIMIT }
  ): Observable<SearchResponse> {
    // KHÔNG dùng { fromObject: apiParams } nữa để loại bỏ hoàn toàn lỗi dữ liệu ẩn
    const params = new HttpParams()
      .set('q', term)
      .set('type', 'track,artist,album,playlist')
      .set('limit', '10') // Thử hạ hẳn xuống 10
      .set('offset', '0');

    return this.http.get<SpotifyApi.SearchResponse>(`${this.appConfig.baseURL}/search`, { params });
  }
}
