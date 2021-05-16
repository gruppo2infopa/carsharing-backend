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

    const [existingVehicle] = await this.vehicleRepository.find({
      licensePlate: dto.licensePlate,
    });
    if (existingVehicle != undefined)
      throw new BadRequestError('Vehicle already registered');

    return await this.vehicleRepository.save({
      ...dto,
      vehicleModel,
      bookings: [],
    });
  }

  async updateVehicle(id: number, dto: CreateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findOne({ id });
    if (existingVehicle === undefined)
      throw new NotFoundError('Vehicle not found');

    const vehicleModel = await this.vehicleModelRepository.findOne(dto.modelId);
    if (vehicleModel == undefined)
      throw new NotFoundError('Vehicle model not found');

    return await this.vehicleRepository.save({
      ...existingVehicle,
      ...dto,
      vehicleModel,
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

  async updateVehicleModel(
    id: number,
    dto: CreateVehicleModelDto
  ): Promise<VehicleModel> {
    const existingVehicleModel = await this.vehicleModelRepository.findOne({
      id,
    });
    if (existingVehicleModel === undefined)
      throw new NotFoundError('Vehicle model not found');

    return await this.vehicleModelRepository.save({
      ...existingVehicleModel,
      ...dto,
    });
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({ relations: ['vehicleModel'] });
  }

  async getAllVehicleModels(): Promise<VehicleModel[]> {
    return await this.vehicleModelRepository.find({});
  }
}

export const vehicleService = new VehicleService();
