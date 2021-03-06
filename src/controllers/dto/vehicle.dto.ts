import {
  Requirement,
  VehicleModel,
  VehicleType,
} from '../../models/vehicle-model.model';
import { Vehicle } from '../../models/vehicle.model';

export class CreateVehicleDto {
  licensePlate?: string;
  url: string;
  modelId: number;
  type: string;
}

export class CreateVehicleModelDto {
  name: string;
  displacement?: number;
  seats: number;
  type: string;
  price: number;
}

export class ResponseVehicleDto {
  id: number;
  licensePlate: string;
  model: ResponseVehicleModelDto;

  static fromEntity(vehicle: Vehicle): ResponseVehicleDto {
    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      model: ResponseVehicleModelDto.fromEntity(vehicle.vehicleModel),
    };
  }
}

export class ResponseVehicleModelDto {
  id: number;
  name: string;
  displacement: number;
  seats: number;
  vehicleType: VehicleType;
  requirement: Requirement;
  price: number;

  static fromEntity(vehicleModel: VehicleModel): ResponseVehicleModelDto {
    return {
      id: vehicleModel.id,
      name: vehicleModel.name,
      displacement: vehicleModel.displacement,
      seats: vehicleModel.seats,
      vehicleType: vehicleModel.vehicleType,
      requirement: Requirement.getRequirement(vehicleModel),
      price: vehicleModel.price,
    };
  }
}

export class ResponseVehicleListDto {
  vehicles: ResponseVehicleDto[];

  static fromEntity(vehicles: Vehicle[]): ResponseVehicleListDto {
    return {
      vehicles: vehicles.map((vehicle) =>
        ResponseVehicleDto.fromEntity(vehicle)
      ),
    };
  }
}

export class ResponseVehicleModelListDto {
  vehicleModels: ResponseVehicleModelDto[];

  static fromEntity(
    vehicleModels: VehicleModel[]
  ): ResponseVehicleModelListDto {
    return {
      vehicleModels: vehicleModels.map((vehicleModel) =>
        ResponseVehicleModelDto.fromEntity(vehicleModel)
      ),
    };
  }
}
