import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DriverLicenseType } from './driver-license.model';
import { Vehicle } from './vehicle.model';

@Entity()
export class VehicleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'float', nullable: true })
  displacement: number;

  @Column()
  seats: number;

  @Column()
  vehicleType: VehicleType;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel)
  vehicles: Vehicle[];
}

export class Requirement {
  minimumAge: number;
  driverLicenseType: DriverLicenseType | null;

  public static getRequirement(VehicleModel: VehicleModel): Requirement {
    // TODO: da cambiare con i valori corretti
    return {
      minimumAge: 21,
      driverLicenseType: DriverLicenseType.A2,
    };
  }
}

export enum VehicleType {
  CAR = 'CAR',
  MOTORBIKE = 'MOTORBIKE',
  ELECTRICAL_SCOOTER = 'ELECTRICAL_SCOOTER',
  BIKE = 'BIKE',
}
