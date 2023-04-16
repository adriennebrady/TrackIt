import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';
import { ContainerCardPageComponent } from './container-card-page/container-card-page.component';
import { SearchComponent } from './search/search.component';
import { RecentlyDeletedComponent } from './recently-deleted/recently-deleted.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'TrackIt | Home' },
  { path: 'about', component: AboutComponent, title: 'TrackIt | About' },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'TrackIt | Login',
  },
  {
    path: 'signup',
    component: SignUpPageComponent,
    title: 'TrackIt | Sign Up',
  },
  {
    path: 'inventory',
    component: InventoryPageComponent,
    title: 'TrackIt | Inventory',
    canActivate: [AuthGuard],
  },
  {
    path: 'containers/:id',
    component: ContainerCardPageComponent,
    title: 'TrackIt | Containers',
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'search',
    component: SearchComponent,
    title: 'TrackIt | Search',
    canActivate: [AuthGuard],
  },
  {
    path: 'recentlyDeleted',
    component: RecentlyDeletedComponent,
    title: 'TrackIt | Recently Deleted',
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'TrackIt | Settings',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
