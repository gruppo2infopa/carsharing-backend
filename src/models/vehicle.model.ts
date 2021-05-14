import {
  ChildEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Booking } from './booking.model';
import { DriverLicenseType } from './driver-license.model';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  public abstract getRequirement(): Requirement;
}

@ChildEntity()
export class Car extends Vehicle {
  @Column({ unique: true })
  carLicensePlate: string;

  @Column()
  carSeats: number;

  @Column('float')
  carDisplacement: number;

  public getAutonomy(): number {
    // TODO: valori corretti
    return 1;
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    if (this.carDisplacement > 55.0)
      return { minimumAge: 21, driverLicenseType: DriverLicenseType.B };
    else return { minimumAge: 18, driverLicenseType: DriverLicenseType.B };
  }
}

@ChildEntity()
export class ElectricalScooter extends Vehicle {
  public getAutonomy(): number {
    // TODO: valori corretti
    return 1;
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: null };
  }
}

@ChildEntity()
export class Motorbike extends Vehicle {
  @Column({ unique: true })
  motorbikeLicensePlate: string;

  @Column('float')
  motorbikeDisplacement: number;

  public getAutonomy(): number {
    // TODO: valori corretti
    return 1;
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A };
  }
}

@ChildEntity()
export class Bike extends Vehicle {
  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A2 };
  }
}

export interface Requirement {
  minimumAge: number;
  driverLicenseType: DriverLicenseType | null;
}
