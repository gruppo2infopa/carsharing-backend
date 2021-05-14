import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { requireAuth } from '../middlewares/require-auth.handler';
import {
  AvailableVehicles,
  BookingDetails,
  BookingPayment,
  BookingSummary,
  VehicleDetails,
} from './dto/booking.dto';

const router = Router();

// makeNewBooking
router.post(
  '/',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const bookingDetails: BookingDetails = req.body;
    const { email } = req.userToken!;

    const availableVehicles: AvailableVehicles =
      await bookingService.createPendingBooking(email, bookingDetails);

    res.status(201).send(availableVehicles);
  }
);

// selectVehicle
router.put(
  '/:id/vehicle', // ??
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const vehicleDetails: VehicleDetails = req.body;
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
    const paymentDetails: BookingPayment = req.body;
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
    const bookings: BookingSummary[] = await bookingService.getBookings(email);
    res.status(200).send(bookings);
  }
);

export { router as BookingRouter };
