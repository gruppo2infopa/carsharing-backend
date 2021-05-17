import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { requireAuth } from '../middlewares/require-auth.handler';
import {
  CreateBookingDto,
  ResponseAvailableVehiclesDto,
  ResponseBookingSummaryDto,
  UpdateBookingWithPaymentDto,
  UpdateBookingWithVehicleDto,
} from './dto/booking.dto';
import { Booking } from '../models/booking.model';

const router = Router();

// makeNewBooking
router.post(
  '/',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingDetails: CreateBookingDto = req.body;
    const { email } = req.userToken!;

    const availableVehicles: ResponseAvailableVehiclesDto =
      await bookingService.createPendingBooking(email, bookingDetails);

    res.status(201).send(availableVehicles);
  }
);

// selectVehicle
router.put(
  '/:id/vehicle',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email } = req.userToken!;
    const vehicleDetails: UpdateBookingWithVehicleDto = req.body;
    const totalPrice = await bookingService.updateBookingVehicle(
      parseInt(id),
      email,
      vehicleDetails.vehicleId
    );

    // return total booking price
    res.status(200).send({ totalPrice }); // DTO anziché restituire un singolo valore?
  }
);

// makePayment
router.put(
  '/:id/payment',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email } = req.userToken!;
    const updateBookingPaymentDto: UpdateBookingWithPaymentDto = req.body;
    const booking = await bookingService.makePayment(
      email,
      parseInt(id),
      updateBookingPaymentDto
    );

    // restituire unlockCode del veicolo prenotato
    res.status(200).send(ResponseBookingSummaryDto.fromEntity(booking));
  }
);

// cancel booking
router.put(
  '/:id',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email } = req.userToken!;

    await bookingService.cancelBooking(parseInt(id));
    res.status(200).send('Booking correctly canceled');
  }
);

// get bookings
router.get(
  '/',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.userToken!;

    // restituire tutti i booking
    const bookings: Booking[] = await bookingService.getBookings(email);
    res.status(200).send(bookings.map(ResponseBookingSummaryDto.fromEntity));
  }
);

export { router as BookingRouter };
