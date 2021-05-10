import {
  Bike,
  Car,
  ElectricalScooter,
  Motorbike,
  Requirement,
} from '../models/vehicle.model';
import { Vehicle } from '../models/vehicle.model';
import { VehicleModel } from './models/vehicle.db.model';
import { CarAttr, CarModel } from './models/car.db.model';

class VehicleRepository {
  private static instance: VehicleRepository;

  static getInstance() {
    if (!this.instance) {
      this.instance = new VehicleRepository();
    }

    return this.instance;
  }

  async saveVehicle(vehicle: Vehicle) {
    let type: string = '';
    if (vehicle instanceof Car) {
      type = 'Car';
    } else if (vehicle instanceof Bike) {
      type = 'Bike';
    } else if (vehicle instanceof Motorbike) {
      type = 'Motorbike';
    } else if (vehicle instanceof ElectricalScooter) {
      type = 'ElectricalScooter';
    }
    const { id } = await VehicleModel.create({ type });
    vehicle.id = id;

    if (vehicle instanceof Car) {
      const { autonomy, displacement, id, seats, licensePlate } = vehicle;
      await CarModel.create({
        autonomy,
        id,
        seats,
        displacement,
        licensePlate,
      });
    } else if (vehicle instanceof Bike) {
      const { id } = vehicle;
    } else if (vehicle instanceof Motorbike) {
      const { id, displacement, licensePlate } = vehicle;
    } else if (vehicle instanceof ElectricalScooter) {
      const { id, autonomy } = vehicle;
    }
  }

  async findVehicles(): Promise<Vehicle[]> {
    return [];
  }

  async findVehiclesByRequirement(
    requirement: Requirement
  ): Promise<Vehicle[]> {
    return [];
  }
}

export { VehicleRepository };
