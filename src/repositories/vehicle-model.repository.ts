import { EntityRepository, Repository } from 'typeorm';
import { VehicleModel } from '../models/vehicle-model.model';

@EntityRepository(VehicleModel)
export class VehicleModelRepository extends Repository<VehicleModel> {}
