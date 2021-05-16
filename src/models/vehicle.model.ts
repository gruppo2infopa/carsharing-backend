import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.model';
import { VehicleModel } from './vehicle-model.model';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  licensePlate: string;

  @Column()
  url: string;

  @ManyToOne(() => VehicleModel, (vehicleModel) => vehicleModel.vehicles)
  vehicleModel: VehicleModel;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];
}
