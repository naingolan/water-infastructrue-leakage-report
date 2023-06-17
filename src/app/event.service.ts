import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private problemAddedSource = new Subject<void>();

  problemAdded$ = this.problemAddedSource.asObservable();

  emitProblemAdded(): void {
    this.problemAddedSource.next();
  }
}
