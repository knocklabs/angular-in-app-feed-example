import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Notifications } from 'src/models/notifications.models';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.scss']
})
export class NotificationsFeedComponent {
  @Input() notifications?: Notifications[];
}
