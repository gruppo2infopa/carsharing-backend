import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { VehicleInfo } from './dto/vehicle.dto';
import { vehicleService } from '../services/vehicle.service';
import { UserRole } from '../models/user.model';

const router = Router();

// registerVehicle
router.post(
  '/',
  requireAuth([UserRole.COMPANY_ADMINISTRATOR]),
  async (req: Request, res: Response, next: NextFunction) => {
    const vehicleInfo: VehicleInfo = req.body;
    vehicleService.registerVehicle(vehicleInfo);

    res.status(201).send({});
  }
);

export { router as VehicleRouter };
