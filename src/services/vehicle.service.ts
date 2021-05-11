import { getCustomRepository, Repository } from 'typeorm';
import { VehicleInfo } from '../controllers/dto/vehicle.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { Vehicle } from '../models/vehicle.model';
import {
  BikeRepository,
  CarRepository,
  ElectricalScooterRepository,
  MotorbikeRepository,
} from '../repositories/vehicle.repository';

class VehicleService {
  private repositories: Map<string, Repository<Vehicle>> = new Map<
    string,
    Repository<Vehicle>
  >([
    ['CAR', getCustomRepository(CarRepository)],
    ['MOTORBIKE', getCustomRepository(MotorbikeRepository)],
    ['BIKE', getCustomRepository(BikeRepository)],
    ['ELECTRICALSCOOTER', getCustomRepository(ElectricalScooterRepository)],
  ]);

  async registerVehicle(vehicleInfo: VehicleInfo) {
    const { type } = vehicleInfo;
    const vehicleRepository = this.repositories.get(type.toUpperCase());

    if (type === 'CAR' || type === 'MOTORBIKE') {
      const { licensePlate } = vehicleInfo;
      const [existingVehicle] = await (
        vehicleRepository as CarRepository | MotorbikeRepository
      ).find({ licensePlate });
      if (existingVehicle != undefined)
        throw new BadRequestError('Vehicle already registered');
    }

    vehicleRepository?.save({ ...vehicleInfo, bookings: [] });
  }
}

export const vehicleService = new VehicleService();
