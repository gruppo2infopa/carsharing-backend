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
  private carRepository: CarRepository = getCustomRepository(CarRepository);
  private motorbikeRepository: MotorbikeRepository =
    getCustomRepository(MotorbikeRepository);
  private bikeRepository: BikeRepository = getCustomRepository(BikeRepository);
  private electricalScooterRepository: ElectricalScooterRepository =
    getCustomRepository(ElectricalScooterRepository);

  async registerVehicle(vehicleInfo: VehicleInfo) {
    const { type } = vehicleInfo;
    const vehicleRepository = this.repositories.get(type.toUpperCase());

    let existingVehicles: Vehicle[] = [];
    if (type === 'CAR') {
      const { licensePlate } = vehicleInfo;
      existingVehicles = await (
        this.repositories.get(type) as CarRepository
      ).find({ where: { carLicensePlate: licensePlate } });
    } else if (type === 'MOTORBIKE') {
      const { licensePlate } = vehicleInfo;
      existingVehicles = await (
        this.repositories.get(type) as MotorbikeRepository
      ).find({ where: { motorbikeLicensePlate: licensePlate } });
    }
    console.log(existingVehicles);

    if (type === 'CAR') {
      const {
        licensePlate: carLicensePlate,
        displacement: carDisplacement,
        seats: carSeats,
      } = vehicleInfo;
      this.carRepository.save({
        carLicensePlate,
        carDisplacement,
        carSeats,
        bookings: [],
      });
    } else if (type === 'MOTORBIKE') {
      const {
        licensePlate: motorbikeLicensePlate,
        displacement: motorbikeDisplacement,
      } = vehicleInfo;
      this.carRepository.save({
        carLicensePlate: motorbikeLicensePlate,
        carDisplacement: motorbikeDisplacement,
        bookings: [],
      });
    } else if (type === 'ELECTRICALSCOOTER') {
      this.electricalScooterRepository.save({ bookings: [] });
    } else {
      this.bikeRepository.save({ bookings: [] });
    }

    if (existingVehicles.length)
      throw new BadRequestError('Vehicle already registered');
  }
}

export const vehicleService = new VehicleService();
