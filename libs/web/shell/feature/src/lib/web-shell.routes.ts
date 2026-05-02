import { Route } from '@angular/router';
import { LayoutComponent } from '@angular-spotify/web/shell/ui/layout';
import { RouterUtil } from '@angular-spotify/web/shared/utils';
// Khách được mời tới
import { LandingPageComponent } from './landing-page/landing-page.component';

export const webShellRoutes: Route[] = [
  // 1. CỔNG CHÍNH: Gõ localhost:4200 là vào đây
  {
    path: '', 
    component: LandingPageComponent,
  },
  
  // 2. NHÀ TRONG: Đăng nhập xong bế qua localhost:4200/app
  {
    path: 'app', // <--- TUI SỬA THÀNH 'app' RỒI NÈ
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('@angular-spotify/web/home/feature')).HomeModule
      },
      {
        path: 'browse',
        loadChildren: async () =>
          (await import('@angular-spotify/web/browse/feature/shell')).BrowseShellModule
      },
      {
        path: 'search',
        loadChildren: async () => (await import('@angular-spotify/web/search/feature')).SearchModule
      },
      {
        path: 'collection/playlists',
        loadChildren: async () =>
          (await import('@angular-spotify/web/playlist/feature/list')).PlaylistsModule
      },
      {
        path: 'collection/tracks',
        loadChildren: async () => (await import('@angular-spotify/web/tracks/feature')).TracksModule
      },
      {
        path: `playlist`,
        loadChildren: async () =>
          (await import('@angular-spotify/web/playlist/feature/detail')).PlaylistModule
      },
      {
        path: `albums`,
        loadChildren: async () =>
          (await import('@angular-spotify/web/album/feature/shell')).AlbumShellModule
      },
      {
        path: `artist`,
        loadChildren: async () => (await import('@angular-spotify/web/artist/feature')).ArtistModule
      },
      {
        path: 'container-queries',
        loadChildren: async () =>
          (await import('@angular-spotify/web/container-queries')).containerQueriesRoutes
      },
      {
        path: 'future-responsive',
        loadChildren: async () =>
          (await import('@angular-spotify/web/future-responsive')).futureResponsiveRoutes
      },
      {
        path: RouterUtil.Configuration.Visualizer,
        loadChildren: async () =>
          (await import('@angular-spotify/web/visualizer/feature')).VisualizerModule
      },
      {
        path: RouterUtil.Configuration.Lyrics,
        loadChildren: async () =>
          (await import('@angular-spotify/web/lyrics/feature')).LyricsModule
      },
      {
        path: 'collection',
        redirectTo: 'collection/playlists',
        pathMatch: 'full'
      }
    ]
  }
];