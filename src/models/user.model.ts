import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Booking } from './booking.model';
import { CreditCard } from './credit-card.model';
import { DriverLicense } from './driver-license.model';
import { Notification } from './notification.model';

@Entity()
class User {
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column('date')
  birthDate: Date;

  @Column()
  fiscalCode: string;

  @Column()
  phoneNumber: string;

  @Column('text')
  role: UserRole;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToOne(() => DriverLicense, (driverLicense) => driverLicense.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  driverLicense?: DriverLicense;

  @OneToMany(() => Notification, (notification) => notification.user)
  notification?: Notification;

  @OneToMany(() => CreditCard, (creditCard) => creditCard.user, {
    cascade: true,
  })
  creditCards: CreditCard[];
}

enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ATTENDANT = 'ATTENDANT',
  COMPANY_ADMINISTRATOR = 'COMPANY_ADMINISTRATOR',
}

export { User, UserRole };
