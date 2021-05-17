import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { UpdateUserDto } from './dto/user.dto';
import { userService } from '../services/user.service';
import { UserRole } from '../models/user.model';
import { NotificationDto } from './dto/notification.dto';

const router = Router();

router.post(
  '/update',
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    const updateUserDto: UpdateUserDto = req.body;
    const { email } = req.userToken!;

    userService.updateInfo(email, updateUserDto);

    res.status(200).send({});
  }
);

router.get(
  '/notifications',
  requireAuth([
    UserRole.CUSTOMER,
    UserRole.ATTENDANT,
    UserRole.COMPANY_ADMINISTRATOR,
    UserRole.DRIVER,
  ]),
  async (req: Request, res: Response) => {
    const notifications = await userService.getNotifications(
      req.userToken!.email
    );

    res
      .status(200)
      .send(
        notifications.map((notification) =>
          NotificationDto.fromEntity(notification)
        )
      );
  }
);

export { router as UserRouter };
