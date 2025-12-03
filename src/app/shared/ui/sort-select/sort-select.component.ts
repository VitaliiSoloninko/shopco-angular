import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sort-select',
  imports: [],
  templateUrl: './sort-select.component.html',
  styleUrl: './sort-select.component.scss',
})
export class SortSelectComponent {
  sortBy = input<string>();
  sortOptions = input<{ value: string; label: string }[]>([]);
  sortChange = output<string>();

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}
