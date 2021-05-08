import { VehicleInfo } from '../controllers/dto/vehicle.dto';

class VehicleService {
  private static instance: VehicleService;

  private constructor() {}

  static getInstance(): VehicleService {
    if (!this.instance) {
      this.instance = new VehicleService();
    }

    return this.instance;
  }

  public registerVehicle(userEmail: string, vehicleInfo: VehicleInfo) {}
}

export { VehicleService };
