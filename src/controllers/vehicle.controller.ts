import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { VehicleInfo } from './dto/vehicle.dto';
import { VehicleService } from '../services/vehicle.service';

const vehicleService = VehicleService.getInstance();
const router = Router();

// registerVehicle
router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.userToken!;
    const vehicleInfo: VehicleInfo = req.body;
    vehicleService.registerVehicle(userEmail, vehicleInfo);

    res.status(201).send({});
  }
);

export { router as VehicleRouter };
