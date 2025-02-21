import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../../core/services/tab.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {

  constructor(public tabService: TabService) {}

  ngOnInit(): void {
    this.tabService.setActiveTab('datos-personales');
  }

  setActive(tabId: string): void {
    this.tabService.setActiveTab(tabId);
  }

  isActive(tabId: string): boolean {
    return this.tabService.isActive(tabId);
  }
}
