import { Component, Input } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent {
  eventForm: FormGroup;

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      name: [''],
      date: [''],
      location: ['']
    });
  }
  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;

      this.eventService.addEvent(newEvent).subscribe({
        next: (response) => {
          console.log('Event successfully added:', response);
          this.eventService.triggerEventListUpdate(); // Listeyi günceller
          this.eventForm.reset();  // Formu temizle
        },
        error: (error) => {
          console.error('Error occurred while adding event:', error);
        }
      });
    }
  }


}

