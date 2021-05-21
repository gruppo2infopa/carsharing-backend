import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.model';
import { CreditCard } from './credit-card.model';

@Entity()
class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;

  @Column('float')
  amount: number;

  @Column()
  date: Date;

  @Column('text')
  state: PaymentState;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.payments, {
    cascade: true,
  })
  creditCard: CreditCard;
}

export enum PaymentState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export { Payment };
