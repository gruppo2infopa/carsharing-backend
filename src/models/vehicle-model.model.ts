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

  @Column('float')
  price: number;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel)
  vehicles: Vehicle[];
}

export class Requirement {
  minimumAge: number;
  requiredDriverLicenseTypes: DriverLicenseType[];

  public static getRequirement(vehicleModel: VehicleModel): Requirement {
    switch (vehicleModel.vehicleType) {
      case VehicleType.BIKE:
        return {
          minimumAge: 12,
          requiredDriverLicenseTypes: [],
        };

      case VehicleType.CAR:
        return {
          minimumAge: 18,
          requiredDriverLicenseTypes: [DriverLicenseType.B],
        };

      case VehicleType.ELECTRICAL_SCOOTER:
        return {
          minimumAge: 14,
          requiredDriverLicenseTypes: [],
        };

      case VehicleType.MOTORBIKE:
        if (vehicleModel.displacement <= 50) {
          return {
            minimumAge: 14,
            requiredDriverLicenseTypes: [
              DriverLicenseType.AM,
              DriverLicenseType.A1,
              DriverLicenseType.A2,
              DriverLicenseType.A,
              DriverLicenseType.B,
            ],
          };
        } else if (vehicleModel.displacement <= 125) {
          return {
            minimumAge: 16,
            requiredDriverLicenseTypes: [
              DriverLicenseType.A1,
              DriverLicenseType.A2,
              DriverLicenseType.A,
            ],
          };
        } else if (vehicleModel.displacement <= 400) {
          return {
            minimumAge: 18,
            requiredDriverLicenseTypes: [
              DriverLicenseType.A2,
              DriverLicenseType.A,
            ],
          };
        } else {
          return {
            minimumAge: 24,
            requiredDriverLicenseTypes: [DriverLicenseType.A],
          };
        }
    }
  }
}

export enum VehicleType {
  CAR = 'CAR',
  MOTORBIKE = 'MOTORBIKE',
  ELECTRICAL_SCOOTER = 'ELECTRICAL_SCOOTER',
  BIKE = 'BIKE',
}
