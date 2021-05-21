import { EntityRepository, Repository } from 'typeorm';
import { Notification } from '../models/notification.model';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {}
