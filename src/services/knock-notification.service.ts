import { Injectable } from '@angular/core';
import Knock, { Feed, FeedItem } from '@knocklabs/client';
import { BehaviorSubject } from 'rxjs';
import { Notifications } from 'src/models/notifications.models';

@Injectable({
  providedIn: 'root'
})
export class KnockNotificationService {
  public knockClient = new Knock('CLIENT_KEY');
  public knockFeed?: Feed;
  public knockFeed$ = new BehaviorSubject(false);
  public notificationCount$ = new BehaviorSubject(null);
  public notificationCount = 0 || null;
  public notifications$ = new BehaviorSubject([
    {
        id: '',
        action: '',
        timeStamp: '',
        readAt: false,
    }
  ]);

  private notifications: Notifications[] = [];
  private notificationsList: FeedItem[] = [];

  constructor() { }

  public connectToKnockFeed(userId: string) {
    this.knockClient.authenticate(userId);
    this.knockFeed = this.knockClient.feeds.initialize('FEED_KEY');
    this.knockFeed.listenForUpdates();

    this.knockFeed.on('items.received.realtime', (res: any) => {
      for (const item of res.items) {
        const notification: Notifications = {
            id: item.id,
            timeStamp: this.getTimeInterval(new Date(item.inserted_at)),
            action: item.data.action, // Set as a custom field in workflow JSON
            readAt: !!item.read_at,
        };

        this.notifications.unshift(notification);
        this.notifications$.next(this.notifications);
        this.notificationCount$.next(this.notificationCount);
        this.notificationsList.unshift(item);
      }
    });

    this.knockFeed.on('items.received.page', (res: any) => {
        this.formatNotificationData(res);
    });

    this.knockFeed.on('items.read', ({ items }: any) => {});

    this.fetchNotifications();
  }

  private formatNotificationData(res: any) {
    if (res.data?.entries?.length > 0 || res.data?.items?.length > 0) {
      this.setNotificationCount(res);
      const notificationsArray = [];

      for (const item of res.data?.entries || res.data.items) {
          const notification: Notifications = {
              id: item.id,
              timeStamp: this.getTimeInterval(new Date(item.inserted_at)),
              action: item.data.action, // Set as a custom field in workflow JSON
              readAt: !!item.read_at,
          };
          notificationsArray.push(notification);
      }

      this.setNotificationData(notificationsArray, res.data.entries)
    } else {
        this.resetNotificationData();
    }
  }

  private setNotificationData(notifications: Notifications[], entries: any) {
    if (notifications.length > 0) {
        this.notifications = notifications;
        this.notificationsList = entries;
        this.notifications$.next(this.notifications);
        this.notificationCount$.next(this.notificationCount);
    }
  }

  private resetNotificationData() {
    this.notifications = [];
    this.notificationsList = [];
    this.notifications$.next(this.notifications);
    this.notificationCount$.next(null);
  }

  private setNotificationCount(res: any) {
    this.notificationCount =
        (res.data?.meta?.unread_count || res?.metadata?.unread_count) === 0
            ? null
            : res.data?.meta?.unread_count || res?.metadata?.unread_count;
  }

  public markAllNotificationsAsRead() {
    this.knockFeed?.markAllAsRead().then(() => {
        this.notificationCount = null;
        this.notificationCount$.next(this.notificationCount);
        this.fetchNotifications();
    });

  }

  private fetchNotifications() {
    this.knockFeed?.fetch().then((res) => {
        if (res) {
            this.formatNotificationData(res);
        }
    });
  }

  public getTimeInterval(date: Date): string {
    const diff: number = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals: [number, string][] = [
      [60, `${diff} second${diff === 1 ? '' : 's'} ago`],
      [3600, `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`],
      [86400, `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`],
      [Infinity, `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`]
    ];
    const [interval, label]: [number, string] = intervals.find(([interval, _]) => diff < interval)!;
    return label;
  }
}
