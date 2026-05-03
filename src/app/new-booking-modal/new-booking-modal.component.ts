import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment, Service } from '../types';

@Component({
  selector: 'app-new-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-booking-modal.component.html',
  styleUrls: ['./new-booking-modal.component.css']
})
export class NewBookingModalComponent {
  @Input() isOpen!: boolean;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{clientName: string, serviceId: string, date: string}>();
  @Input() services!: Service[];
  @Input() existingAppointments!: Appointment[];

  clientName = '';
  serviceId = '';
  date = '';

  onSave() {
    if (this.clientName && this.serviceId && this.date) {
      this.save.emit({ clientName: this.clientName, serviceId: this.serviceId, date: this.date });
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
    this.clientName = '';
    this.serviceId = '';
    this.date = '';
  }
}