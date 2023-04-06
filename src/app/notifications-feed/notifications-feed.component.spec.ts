import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsFeedComponent } from './notifications-feed.component';

describe('NotificationsFeedComponent', () => {
  let component: NotificationsFeedComponent;
  let fixture: ComponentFixture<NotificationsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
