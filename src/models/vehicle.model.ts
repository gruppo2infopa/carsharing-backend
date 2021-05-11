import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.model';
import { DriverLicenseType } from './driver-license.model';

@Entity()
export abstract class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  public abstract getRequirement(): Requirement;
}

@Entity()
export class Car extends Vehicle {
  @Column({ unique: true })
  licensePlate: string;

  @Column('float')
  autonomy: number; // TODO: rimuovere campo. L'autonomia viene ottenuta richiamando il sistema di controllo remoto del veicolo (mockato)

  @Column()
  seats: number;

  @Column('float')
  displacement: number;

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    if (this.displacement > 55.0)
      return { minimumAge: 21, driverLicenseType: DriverLicenseType.B };
    else return { minimumAge: 18, driverLicenseType: DriverLicenseType.B };
  }
}

@Entity()
export class ElectricalScooter extends Vehicle {
  @Column()
  autonomy: number;

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: null };
  }
}

@Entity()
export class Motorbike extends Vehicle {
  @Column({ unique: true })
  licensePlate: string;

  @Column('float')
  autonomy: number;

  @Column('float')
  displacement: number;

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A };
  }
}

@Entity()
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
