import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { NetworkStatusService } from '../../../services/offline/network-status.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { toast } from '../../../animations/toast';
import {toastTop} from "../../../animations/toast-top";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [NgIf, MatIcon],
  templateUrl: './network-status.component.html',
  styleUrl: './network-status.component.scss',
  animations: [toast, toastTop],
})
export class NetworkStatusComponent implements OnInit, OnDestroy {
  protected showOfflineMessage: boolean = false;
  protected showSyncMessage: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private networkStatusService: NetworkStatusService) {
    this.handleOfflineMessage();
    this.handleSyncMessage();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleOfflineMessage() {
    this.networkStatusService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOnline) => {
        this.showOfflineMessage = !isOnline;
        if (!isOnline) {
          timer(7000)
            .pipe(
              takeUntil(this.destroy$),
              tap(() => (this.showOfflineMessage = false)),
            )
            .subscribe();
        }
      });
  }

  private handleSyncMessage(): void {
    this.networkStatusService.isSyncing$
      .pipe(
        switchMap((isSyncing) => {
          if (isSyncing) {
            this.showSyncMessage = true;
            return timer(0);
          } else {
            return timer(5000).pipe(tap(() => (this.showSyncMessage = false)));
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}
