import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { vehicleService } from '../services/vehicle.service';
import { UserRole } from '../models/user.model';
import { validateRequest } from '../middlewares/validate-request.handler';
import { body } from 'express-validator';
import {
  CreateVehicleDto,
  CreateVehicleModelDto,
  ResponseVehicleDto,
  ResponseVehicleModelDto,
} from '../controllers/dto/vehicle.dto';
import { VehicleModel, VehicleType } from '../models/vehicle-model.model';
import { Vehicle } from '../models/vehicle.model';

const router = Router();

// registerVehicle
router.post(
  '/',
  requireAuth([UserRole.CUSTOMER]),
  [
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
    body('licensePlate')
      .if(body('type').not().isIn([VehicleType.CAR, VehicleType.MOTORBIKE]))
      .isEmpty()
      .withMessage('Only Car and Motorbike have a license plate.'),
    body('url').isURL().withMessage('Url must be valid'),
    body('modelId').isInt().withMessage('Model id must be valid'),
    body('type')
      .isIn(Object.keys(VehicleType))
      .withMessage(
        `Type must be one of the following: ${Object.keys(VehicleType)}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const createVehicleDto: CreateVehicleDto = req.body;
    const vehicle: Vehicle = await vehicleService.registerVehicle(
      createVehicleDto
    );

    res.status(201).send(ResponseVehicleDto.fromEntity(vehicle));
  }
);

router.post(
  '/vehiclemodels',
  requireAuth([UserRole.CUSTOMER]),
  [
    body('name').notEmpty().withMessage('Name must be not empty'),
    body('displacement')
      .if(body('type').isIn([VehicleType.CAR, VehicleType.MOTORBIKE]))
      .isFloat({ min: 0.0 })
      .withMessage('Displacement must be positive number'),
    body('displacement')
      .if(body('type').not().isIn([VehicleType.CAR, VehicleType.MOTORBIKE]))
      .isEmpty()
      .withMessage("Car and Motorbike don't have displacement"),
    body('seats')
      .isInt({ min: 1 })
      .withMessage('Seats must be an integer greater or equal than one'),
    body('type')
      .isIn(Object.keys(VehicleType))
      .withMessage(
        `Type must be one of the following: ${Object.keys(VehicleType)}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const vehicleModelDto: CreateVehicleModelDto = req.body;
    const vehicleModel: VehicleModel =
      await vehicleService.registerVehicleModel(vehicleModelDto);

    res.status(200).send(ResponseVehicleModelDto.fromEntity(vehicleModel));
  }
);

export { router as VehicleRouter };
