import { Requirement } from '../models/vehicle.model';
import { Vehicle } from '../models/vehicle.model';

class VehicleRepository {
  private static instance: VehicleRepository;

  static getInstance() {
    if (!this.instance) {
      this.instance = new VehicleRepository();
    }

    return this.instance;
  }

  async saveVehicle(vehicle: Vehicle) {}

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
