import { Component, input, output} from '@angular/core';

@Component({
  selector: 'app-alert-confirm-dialog',
  imports: [],
  templateUrl: './alert-confirm-dialog.component.html',
  styleUrl: './alert-confirm-dialog.component.css',
})
export class AlertConfirmDialogComponent {
  heading = input('Are you sure?');
  message = input('This action cannot be undone.');
  confirmText = input('Confirm');
  loading = input(false);

  confirmed = output<void>();
  cancelled = output<void>();

  cancel(): void {
    if (this.loading()) return;
    this.cancelled.emit();
  }
}
