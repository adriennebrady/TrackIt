import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerCardPageComponent } from './container-card-page/container-card-page.component';

const routes: Routes = [
  {path: 'containers', component: ContainerCardPageComponent, title: "TrackIt | Containers"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
