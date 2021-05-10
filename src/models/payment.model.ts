import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class Payment {
  @Column()
  amount: number;

  @PrimaryColumn()
  reference: string;
}

export { Payment };
