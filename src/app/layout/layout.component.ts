import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  @Input() activeTab!: string;
  @Output() activeTabChange = new EventEmitter<string>();
  @Output() openNewBooking = new EventEmitter<void>();
  @Input() isAdmin!: boolean;
  @Output() logout = new EventEmitter<void>();

  navItems = [
    { id: 'dashboard', label: 'Início', icon: 'dollar-sign', adminOnly: true },
    { id: 'schedule', label: 'Agenda', icon: 'calendar', adminOnly: false },
    { id: 'ai-assistant', label: 'IA Dicas', icon: 'sparkles', adminOnly: false },
  ];

  get visibleNavItems() {
    return this.navItems.filter(item => !item.adminOnly || this.isAdmin);
  }

  setActiveTab(tab: string) {
    this.activeTabChange.emit(tab);
  }

  onOpenNewBooking() {
    this.openNewBooking.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}