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
    console.log(req.body);

    const bookingDetails: CreateBookingDto = req.body;
    const { email } = req.userToken!;

    const availableVehicles: ResponseAvailableVehiclesDto =
      await bookingService.createPendingBooking(email, bookingDetails);

    res.status(201).send(availableVehicles);
  }
);

// selectVehicle
router.put(
  '/vehicle', // ??
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const vehicleDetails: UpdateBookingWithVehicleDto = req.body;
    const totalPrice = await bookingService.updateBookingVehicle(
      vehicleDetails
    );

    // return total booking price
    res.status(200).send({ totalPrice }); // DTO anziché restituire un singolo valore?
  }
);

// makePayment
router.put(
  '/:id/payment', // ??
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentDetails: UpdateBookingWithPaymentDto = req.body;
    const vehicleUnlockCode = await bookingService.makePayment(paymentDetails);

    // restituire unlockCode del veicolo prenotato
    res.status(200).send({ vehicleUnlockCode }); // DTO anziché restituire un singolo valore?
  }
);

// cancel booking
router.put(
  '/:id',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await bookingService.cancelBooking(+id);
    res.status(200).send('Booking correctly canceled');
  }
);

// get bookings
router.get(
  '/',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: add code
    const { email } = req.userToken!;

    // restituire tutti i booking
    const bookings: Booking[] = await bookingService.getBookings(email);
    res.status(200).send(bookings.map(ResponseBookingSummaryDto.fromEntity));
  }
);

export { router as BookingRouter };
