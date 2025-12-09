import { CommonModule } from '@angular/common';
import { Component, HostListener, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent {
  isOpen = signal(false);
  logout = output<void>();

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  onLogout() {
    this.logout.emit();
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.profile-dropdown');
    if (!dropdown) {
      this.closeDropdown();
    }
  }
}
