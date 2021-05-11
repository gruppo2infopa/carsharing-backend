import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class Payment {
  @Column('float')
  amount: number;

  @PrimaryColumn()
  reference: string;
}

export { Payment };
