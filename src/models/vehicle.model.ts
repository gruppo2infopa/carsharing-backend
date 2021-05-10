import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DriverLicenseType } from './driver-license.model';

export abstract class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  public abstract getRequirement(): Requirement;
}

@Entity()
export class Car extends Vehicle {
  @Column()
  licensePlate: string;

  @Column()
  autonomy: number;

  @Column()
  seats: number;

  @Column()
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
  @Column()
  licensePlate: string;

  @Column()
  autonomy: number;

  @Column()
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
