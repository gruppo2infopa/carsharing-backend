import { EntityRepository, Repository } from 'typeorm';
import { Booking } from '../models/booking.model';

@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {}
