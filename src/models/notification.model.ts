import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
class Notification {
  @PrimaryGeneratedColumn()
  id: Number;

  @ManyToOne(() => User, (user) => user.notification)
  user: User;

  @Column()
  message: string;

  @Column()
  isRead: boolean;

  @Column('date')
  issueDate: Date;
}

enum NotificationReply {
  TRAFFIC = 'TRAFFIC',
  OTHER = 'OTHER',
}

export { Notification, NotificationReply };
