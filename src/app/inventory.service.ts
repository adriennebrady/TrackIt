// src/app/inventory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Item,
  Container,
  RecentlyDeletedItem,
  InventoryRequest,
  DeleteRequest,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  // ── Containers ──────────────────────────────────────────

  getContainers(containerId: number): Observable<Container[]> {
    return this.http.get<Container[]>(
      `/api/containers?container_id=${containerId}`
    );
  }

  // ── Items ────────────────────────────────────────────────

  getItems(containerId: number): Observable<Item[]> {
    return this.http.get<Item[]>(
      `/api/items?container_id=${containerId}`
    );
  }

  // ── Container name (breadcrumb path) ─────────────────────

  getContainerName(containerId: number): Observable<string> {
    return this.http.get<string>(
      `/api/name?Container_id=${containerId}`
    );
  }

  // ── Create ───────────────────────────────────────────────

  createInventory(body: InventoryRequest): Observable<void> {
    return this.http.post<void>('/api/inventory', body);
  }

  // ── Update ───────────────────────────────────────────────

  updateInventory(body: InventoryRequest): Observable<void> {
    return this.http.put<void>('/api/inventory', body);
  }

  // ── Delete ───────────────────────────────────────────────

  deleteInventory(body: DeleteRequest): Observable<void> {
    return this.http.delete<void>('/api/inventory', { body });
  }

  // ── Recently Deleted ─────────────────────────────────────

  getDeletedItems(): Observable<RecentlyDeletedItem[]> {
    return this.http.get<RecentlyDeletedItem[]>('/api/deleted');
  }

  deleteDeletedItem(body: DeleteRequest): Observable<void> {
    return this.http.delete<void>('/api/deleted', { body });
  }
}
