// src/app/models.ts

export interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
}

export interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
  Notes: string;
}

export interface RecentlyDeletedItem {
  ItemID: number;
  AccountID: string;
  DeletedItemName: string;
  DeletedItemLocation: number;
  DeletedItemCount: number;
  TimeStamp: string;
}

export interface InventoryRequest {
  Authorization: string;
  Kind: 'container' | 'item' | 'Container' | 'Item';
  ID: number;
  Cont: number;
  Name: string;
  Type: 'Add' | 'Rename' | 'Relocate' | 'Recount' | 'UpdateNotes';
  Count?: number;
}
// src/app/models.ts (add this)
export interface DeleteRequest {
  token: string;
  type: 'item' | 'container';
  id: number;
}
