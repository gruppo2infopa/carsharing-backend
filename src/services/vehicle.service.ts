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

  async getAllVehicleModels(): Promise<VehicleModel[]> {
    return await this.vehicleModelRepository.find({});
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

  async getVehicleModel(vehicleModelId: number): Promise<VehicleModel> {
    const vehicleModel = await this.vehicleModelRepository.findOne({
      id: vehicleModelId,
    });
    if (vehicleModel == undefined)
      throw new NotFoundError('Vehicle model not found');
    return vehicleModel;
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

  async deleteVehicleModel(vehicleModelId: number): Promise<void> {
    const vehicleModel = await this.vehicleModelRepository.findOne({
      relations: ['vehicles'],
      where: {
        id: vehicleModelId,
      },
    });
    if (vehicleModel == undefined)
      throw new NotFoundError('Vehicle model not found');

    if (vehicleModel.vehicles.length > 0)
      throw new BadRequestError(
        'This vehicle model has some instances. Delete those first.'
      );

    await this.vehicleModelRepository.delete(vehicleModelId);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({ relations: ['vehicleModel'] });
  }

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

  async getVehicle(vehicleId: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      relations: ['vehicleModel'],
      where: {
        id: vehicleId,
      },
    });
    if (vehicle == undefined) throw new NotFoundError('Vehicle not found');
    return vehicle;
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

  async deleteVehicle(vehicleId: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne(vehicleId);
    if (vehicle == undefined) throw new NotFoundError('Vehicle not found');

    await this.vehicleRepository.delete(vehicleId);
  }
}

export const vehicleService = new VehicleService();
