import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { UpdateUserDto } from './dto/update-user.dto';
import { userService } from '../services/user.service';
import { UserRole } from '../models/user.model';

const router = Router();

// registerVehicle
router.post(
  '/update',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const updateUserDto: UpdateUserDto = req.body;

    userService.updateInfo(updateUserDto);

    res.status(200).send({});
  }
);

export { router as UserRouter };
