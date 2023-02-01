import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent {
  containers = [ 
    {
      name: 'Fridge',
      description: "All my food is kept in here."
    }, 
    { 
      name: 'Workbench',
      description: "All my tools are kept in here."
    }, 
    {
      name: 'Dresser',
      description: "All my clothes are kept in here."
    }];
}
