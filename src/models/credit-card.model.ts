import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Payment } from './payment.model';
import { User } from './user.model';

@Entity()
export class CreditCard {
  @PrimaryColumn()
  id: String;

  @Column()
  owner: String;

  @ManyToOne(() => User, (user) => user.creditCards, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user?: User;

  @Column()
  cvv: String;

  @Column()
  expiryDate: Date;

  @OneToMany(() => Payment, (payment) => payment.creditCard)
  payments?: Payment[];
}
