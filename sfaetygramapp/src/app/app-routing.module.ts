import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'auth/:token', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'setup', loadChildren: './setup/setup.module#SetupPageModule' },

  { path: 'home', canActivate: [ AuthGuard ], loadChildren: './home/home.module#HomePageModule' },
  { path: 'users', canActivate: [ AuthGuard ], loadChildren: './users/users.module#UsersPageModule' },
  { path: 'users/:id', canActivate: [ AuthGuard ], loadChildren: './users/chat/chat.module#ChatPageModule' },
  { path: 'settings', canActivate: [ AuthGuard ], loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'update', canActivate: [ AuthGuard ], loadChildren: './update/update.module#UpdatePageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
