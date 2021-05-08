import { Router, Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { requireAuth } from '../middlewares/require-auth.handler';
import {
  AvailableVehicles,
  BookingDetails,
  BookingPayment,
  VehicleDetails,
} from './dto/booking.dto';

const bookingService = BookingService.getInstance();
const router = Router();

// makeNewBooking
router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingDetails: BookingDetails = req.body;

      const availableVehicles: AvailableVehicles = await bookingService.createPendingBooking(
        bookingDetails
      );

      res.status(201).send(availableVehicles);
    } catch (error) {
      next(error);
    }
  }
);

// selectVehicle
router.put(
  '/:id/vehicle', // ??
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleDetails: VehicleDetails = req.body;

      const totalPrice = await bookingService.updateBookingVehicle(
        vehicleDetails
      );

      // return total booking price
      res.status(200).send({ totalPrice }); // DTO anziché restituire un singolo valore?
    } catch (error) {
      next(error);
    }
  }
);

// makePayment
router.put(
  '/:id/payment', // ??
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentDetails: BookingPayment = req.body;

      const vehicleUnlockCode = await bookingService.makePayment(
        paymentDetails
      );

      // restituire unlockCode del veicolo prenotato
      res.status(200).send({ vehicleUnlockCode }); // DTO anziché restituire un singolo valore?
    } catch (error) {
      next(error);
    }
  }
);

// cancel booking
router.delete(
  '/:id', // ??
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId: number = req.body;

      await bookingService.cancelBooking(bookingId);

      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

// get bookings
router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: add code

      // restituire tutti i booking
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as BookingRouter };
