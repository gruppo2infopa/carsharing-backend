import { EntityRepository, Repository } from 'typeorm';
import {
  Bike,
  Car,
  ElectricalScooter,
  Motorbike,
  Vehicle,
} from '../models/vehicle.model';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {}

@EntityRepository(Car)
export class CarRepository extends Repository<Car> {}

@EntityRepository(Motorbike)
export class MotorbikeRepository extends Repository<Motorbike> {}

@EntityRepository(ElectricalScooter)
export class ElectricalScooterRepository extends Repository<ElectricalScooter> {}

@EntityRepository(Bike)
export class BikeRepository extends Repository<Bike> {}
