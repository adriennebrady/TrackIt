import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';
import { ContainerCardPageComponent } from './container-card-page/container-card-page.component';

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
    path: 'containers',
    component: ContainerCardPageComponent,
    title: 'TrackIt | Containers',
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
