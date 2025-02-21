import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private activeTab: string = '';

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  isActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
