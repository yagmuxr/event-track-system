import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule'ü buraya ekleyin
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],  // CommonModule'ü standalone bileşenlerde kullanın
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  private eventListUpdateSub!: Subscription;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();

    // Liste güncellemelerini dinle ve yeniden yükle
    this.eventListUpdateSub = this.eventService
      .getEventListUpdateListener()
      .subscribe(() => {
        this.loadEvents();  // Yeni etkinlik eklendiğinde listeyi güncelle
      });
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  onDeleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        console.log(`Event with ID ${id} deleted`);
        this.loadEvents();  // Listeyi yeniden yükle
      },
      error: (error) => {
        console.error('Error deleting event:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventListUpdateSub) {
      this.eventListUpdateSub.unsubscribe();  // Aboneliği iptal et
    }
  }
}
