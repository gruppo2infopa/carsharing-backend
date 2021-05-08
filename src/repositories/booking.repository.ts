import { Booking } from '../models/booking.model';

class BookingRepository {
  private static instance: BookingRepository;

  static getInstance() {
    if (!this.instance) {
      this.instance = new BookingRepository();
    }

    return this.instance;
  }

  async saveBooking(booking: Booking) /*: Promise<Booking> */ {
    // TODO: add code
  }

  async findUser(userEmail: string): Promise<Booking | null> {
    // TODO: add code
    return null;
  }
}

export { BookingRepository };
