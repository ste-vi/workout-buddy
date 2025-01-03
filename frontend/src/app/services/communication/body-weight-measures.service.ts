import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BodyWeightMeasuresService {
  private openModalSource = new Subject<void>();

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal() {
    this.openModalSource.next();
  }
}
