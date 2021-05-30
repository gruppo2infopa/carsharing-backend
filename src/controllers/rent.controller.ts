import { Router, Request, Response } from 'express';

import { requireAuth } from '../middlewares/require-auth.handler';
import { UserRole } from '../models/user.model';
import { rentService } from '../services/rent.service';
import { RentDto, UpdateRentDto } from './dto/rent.dto';

const router = Router();

router.post(
  '/startrent',
  requireAuth([UserRole.CUSTOMER, UserRole.ATTENDANT, UserRole.DRIVER]),
  async (req: Request, res: Response) => {
    const startRentDto: RentDto = req.body;
    const { email, role } = req.userToken!;

    rentService.startRent(role, email, startRentDto);
    res.status(200).send('Rent started successfuly');
  }
);

router.post(
  '/endrent',
  requireAuth([UserRole.CUSTOMER, UserRole.ATTENDANT, UserRole.DRIVER]),
  async (req: Request, res: Response) => {
    const endRentDto: RentDto = req.body;
    const { email, role } = req.userToken!;

    rentService.endRent(role, email, endRentDto);
    res.status(200).send('Rent ended successfuly');
  }
);

router.post(
  '/notifyproblem', 
  requireAuth([UserRole.CUSTOMER]),
  async (req: Request, res: Response) => {
    const updateRentDto: UpdateRentDto = req.body;
    const { email, role } = req.userToken!;
    rentService.notifyProblem(updateRentDto, email);
    res.status(201).send({});
  }  
);

export { router as RentRouter };
