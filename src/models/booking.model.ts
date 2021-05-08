import { User } from './user.model';

class Booking {
  constructor(
    public id: number,
    public startDate: Date,
    public endDate: Date,
    public unlockCode: string,
    public state: BookingState,
    public rentType: RentType,
    public user: User,
    public driver?: User,
    public finalDestination?: string
  ) {}
}

enum BookingState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

enum RentType {
  FREE_FLOATING = 'FREE_FLOATING',
  ONE_WAY = 'ONE_WAY',
  WITH_DRIVER = 'WITH_DRIVER',
}

export { Booking, BookingState, RentType };
