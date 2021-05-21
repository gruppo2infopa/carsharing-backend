import { Notification } from '../../models/notification.model';

export class NotificationDto {
  issueDate: Date;
  message: string;

  static fromEntity(notification: Notification): NotificationDto {
    return {
      issueDate: notification.issueDate,
      message: notification.message,
    };
  }
}
