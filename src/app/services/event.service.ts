import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/events';
  private eventListUpdate = new Subject<void>();  // Liste güncelleme işlemleri için Subject

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event);
  }

  // Liste güncellemelerini tetiklemek için kullanılan metot
  triggerEventListUpdate() {
    this.eventListUpdate.next();
  }
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // Liste güncellemelerini dinlemek için kullanılan Observable
  getEventListUpdateListener(): Observable<void> {
    return this.eventListUpdate.asObservable();
  }
}
