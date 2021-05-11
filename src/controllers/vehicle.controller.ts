import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { VehicleInfo } from './dto/vehicle.dto';
import { vehicleService } from '../services/vehicle.service';
import { UserRole } from '../models/user.model';
import { validateRequest } from '../middlewares/validate-request.handler';
import { body } from 'express-validator';

const router = Router();

// registerVehicle
router.post(
  '/',
  requireAuth([UserRole.COMPANY_ADMINISTRATOR]),
  [
    body('type')
      .toUpperCase()
      .isIn(['CAR', 'MOTORBIKE', 'BIKE', 'ELECTRICALSCOOTER'])
      .withMessage(
        'Type must be on of the following: CAR, MOTORBIKE, BIKE, ELECTRICALSCOOTER'
      ), //TODO: refactor
    body('licensePlate')
      .toUpperCase()
      .if(body('type').equals('CAR'))
      .matches('^[A-Z]{2}[0-9]{3}[A-Z]{2}$', 'g')
      .withMessage('License plate must be valid'),
    body('licensePlate')
      .toUpperCase()
      .if(body('type').equals('MOTORBIKE'))
      .matches('^[A-Z]{2}[0-9]{4}$', 'g')
      .withMessage('License plate must be valid'),
    body('autonomy')
      .isFloat({ min: 0.0, max: 100.0 })
      .withMessage('Autonomy must be valid'),
    body('seats')
      .isInt({ min: 1 })
      .withMessage('Seats must be an integer greater or equal than one'),
    body('displacement')
      .isFloat({ min: 0.0 })
      .withMessage('Displacement must be a non negative float'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const vehicleInfo: VehicleInfo = req.body;
    await vehicleService.registerVehicle(vehicleInfo);

    res.status(201).send({});
  }
);

export { router as VehicleRouter };
