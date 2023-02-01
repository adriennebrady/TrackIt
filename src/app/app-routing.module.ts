import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';

const routes: Routes = [
  {path: 'inventory', component: InventoryPageComponent, title: "TrackIt | Inventory"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
