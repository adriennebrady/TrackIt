import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private _expandedNodes: number[] = [];

  constructor() {
    // Load expanded nodes from localStorage on service initialization
    const savedNodes = localStorage.getItem('expandedNodes');
    if (savedNodes) {
      try {
        this._expandedNodes = JSON.parse(savedNodes);
      } catch (error) {
        console.error('Error parsing expanded nodes:', error);
        this._expandedNodes = [];
      }
    }
  }

  toggleNodeExpansion(nodeId: number) {
    const index = this._expandedNodes.indexOf(nodeId);
    if (index > -1) {
      // Node is already expanded, so remove it
      this._expandedNodes.splice(index, 1);
    } else {
      // Node is not expanded, so add it
      this._expandedNodes.push(nodeId);
    }

    // Save to localStorage
    localStorage.setItem('expandedNodes', JSON.stringify(this._expandedNodes));
  }

  isNodeExpanded(nodeId: number): boolean {
    return this._expandedNodes.includes(nodeId);
  }

  getExpandedNodes(): number[] {
    return [...this._expandedNodes];
  }
}