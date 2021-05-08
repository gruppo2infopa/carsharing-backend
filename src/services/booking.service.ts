import {
  BookingSummary,
  AvailableVehicles,
  BookingDetails,
  BookingPayment,
  VehicleDetails,
} from '../controllers/dto/booking.dto';

class BookingService {
  private static instance: BookingService;

  private constructor() {}

  static getInstance(): BookingService {
    if (!this.instance) {
      this.instance = new BookingService();
    }

    return this.instance;
  }

  async createPendingBooking(
    bookingDetails: BookingDetails
  ): Promise<AvailableVehicles> {
    const availableVehicles: AvailableVehicles = {
      bookingId: -1,
      availableVehicles: [],
    };
    return availableVehicles;
  }

  async updateBookingVehicle(vehicleDetails: VehicleDetails): Promise<number> {
    // TODO: add code
    return -1;
  }

  async makePayment(paymentDetails: BookingPayment): Promise<string> {
    // TODO: add code
    return '';
  }

  async cancelBooking(bookingId: number) {
    // TODO: add code
  }

  async getBookings(userId: number): Promise<BookingSummary[]> {
    // TODO: add code
    return [];
  }
}

export { BookingService };
