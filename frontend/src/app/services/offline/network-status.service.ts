import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {SyncService} from "./sync.service";

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService implements OnDestroy {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private isSyncingSubject = new BehaviorSubject<boolean>(false);

  constructor(private syncService: SyncService) {
    this.setupListeners();
  }

  get isOnline$(): Observable<boolean> {
    return this.isOnlineSubject.asObservable();
  }

  get isSyncing$(): Observable<boolean> {
    return this.isSyncingSubject.asObservable();
  }

  private setupListeners(): void {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean): void {
    this.isOnlineSubject.next(isOnline);
    console.log(`Network status changed: ${isOnline}`);
    if (isOnline) {
      this.syncData();
    }
  }

  private syncData(): void {
    this.isSyncingSubject.next(true);
    this.syncService.sync().subscribe({
      complete: () => this.isSyncingSubject.next(false),
      error: () => this.isSyncingSubject.next(false)
    });
  }

  ngOnDestroy(): void {
  }
}
