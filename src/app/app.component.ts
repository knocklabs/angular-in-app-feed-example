import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Notifications } from 'src/models/notifications.models';
import { KnockNotificationService } from 'src/services/knock-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public count = 0;
  public notifications?: Notifications[];
  private onDestroy$ = new Subject();
  constructor(public service: KnockNotificationService){
    this.service.connectToKnockFeed('USER_ID')
  }

  ngOnInit(): void {
      this.service.notificationCount$.pipe(takeUntil(this.onDestroy$)).subscribe(response => {
        if (response) {
          this.count = response;
        }
      });

      this.service.notifications$.pipe(takeUntil(this.onDestroy$)).subscribe(response => {
        if (response) {
          this.notifications = response;
        }
      });
  }

  ngOnDestroy(): void {
      this.onDestroy$.next(true);
      this.onDestroy$.complete();
  }
}
