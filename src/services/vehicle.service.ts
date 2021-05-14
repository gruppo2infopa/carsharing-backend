import { getCustomRepository } from 'typeorm';
import {
  CreateVehicleDto,
  CreateVehicleModelDto,
} from '../controllers/dto/vehicle.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { VehicleModel, VehicleType } from '../models/vehicle-model.model';
import { Vehicle } from '../models/vehicle.model';
import { VehicleModelRepository } from '../repositories/vehicle-model.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';

class VehicleService {
  private vehicleModelRepository: VehicleModelRepository = getCustomRepository(
    VehicleModelRepository
  );
  private vehicleRepository: VehicleRepository =
    getCustomRepository(VehicleRepository);

  async registerVehicle(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicleModel = await this.vehicleModelRepository.findOne(dto.modelId);
    if (vehicleModel == undefined)
      throw new NotFoundError('Vehicle model not found');

    const { licensePlate } = dto;
    const [existingVehicle] = await this.vehicleRepository.find({
      licensePlate,
    });
    if (existingVehicle != undefined)
      throw new BadRequestError('Vehicle already registered');

    return await this.vehicleRepository.save({
      ...dto,
      vehicleModel,
      bookings: [],
    });
  }

  async registerVehicleModel(
    dto: CreateVehicleModelDto
  ): Promise<VehicleModel> {
    const [existingVehicleModel] = await this.vehicleModelRepository.find({
      name: dto.name,
    });
    if (existingVehicleModel != undefined)
      throw new BadRequestError('Vehicle model already registered');

    return await this.vehicleModelRepository.save({
      ...dto,
      vehicleType: <VehicleType>dto.type,
      vehicles: [],
    });
  }
}

export const vehicleService = new VehicleService();
