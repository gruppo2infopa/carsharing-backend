import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { Vehicle } from './vehicle.model';

@Entity()
class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column()
  unlockCode?: string;

  @Column('text')
  state: BookingState;

  @Column('text')
  rentType: RentType;

  @Column()
  finalDestination?: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => User, (user) => user.bookings)
  driver?: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings)
  vehicle: Vehicle;
}

enum BookingState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

enum RentType {
  FREE_FLOATING = 'FREE_FLOATING',
  ONE_WAY = 'ONE_WAY',
  WITH_DRIVER = 'WITH_DRIVER',
}

export { Booking, BookingState, RentType };
