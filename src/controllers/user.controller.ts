import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth.handler';
import { UpdateUserDto, UserInfoDto } from './dto/user.dto';
import { userService } from '../services/user.service';
import { User, UserRole } from '../models/user.model';
import { NotificationDto } from './dto/notification.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { saveUserFile, deleteUserFile } from '../utils/file';
import { UploadedFile } from 'express-fileupload';
import { body, check } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request.handler';
import { multipartParse } from '../middlewares/multipart.handler';

const router = Router();

//updateUserInfo
router.put(
  '/update',
  multipartParse('data'),
  requireAuth(),
  [
    body('data.phoneNumber')
      .isMobilePhone(['it-IT', 'en-US'])
      .withMessage('Phone number must be correct'),
    body('data.driverLicense.issueDate')
      .if(body('data.driverLicense').exists())
      .isDate()
      .withMessage('issueDate must be valid'),
    body('data.driverLicense.expiryDate')
      .if(body('data.driverLicense').exists())
      .isDate()
      .withMessage('expiryDate must be valid'),
    body('data.driverLicense.categories')
      .if(body('data.driverLicense').exists())
      .isArray({ min: 1 })
      .withMessage('at lest one category must be specified'),
    body('data.driverLicense.categories.*.name')
      .if(body('data.driverLicense').exists())
      .isIn(['AM', 'A1', 'A2', 'A', 'B'])
      .withMessage(
        `license type must be one of ${['AM', 'A1', 'A2', 'A', 'B']}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const updateUserDto: UpdateUserDto = req.body.data;
    const { email } = req.userToken!;

    console.log(updateUserDto);

    if (updateUserDto.driverLicense != undefined) {
      if (req.files?.driverLicenseImage != undefined) {
        await saveUserFile(
          req.files.driverLicenseImage as UploadedFile,
          email,
          'driverLicense.jpg'
        );
      } else
        throw new BadRequestError(
          'You must also upload the driver license image'
        );
    }

    try {
      await userService.updateInfo(email, updateUserDto);
    } catch (error) {
      deleteUserFile(email, 'driverLicense.jpg');
      throw error;
    }

    res.status(200).send({});
  }
);

//unlinkCreditCard
router.put(
  '/unlink/:id',
  requireAuth(),
  async (req: Request, res: Response) => {
    const { email } = req.userToken!;
    const { id } = req.params;
    userService.unlinkCard(email, id);

    res.status(200).send({});
  }
);

//getCreditCards
router.get(
  '/creditCards',
  requireAuth(),
  async (req: Request, res: Response) => {
    const { email } = req.userToken!;
    const creditCards = await userService.getCreditCards(email);

    res.status(200).send(creditCards);
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
router.get('/', requireAuth(), async (req: Request, res: Response) => {
  const { email } = req.userToken!;

  const user = await userService.getPersonalInfo(email);

  res.status(200).send(UserInfoDto.fromEntity(user));
});

export { router as UserRouter };
