import { Routes } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventListComponent } from './components/event-list/event-list.component';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event-form', component: EventFormComponent },
];
