import { EntityRepository, Repository } from 'typeorm';
import { Vehicle } from '../models/vehicle.model';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {}
