import { Router, Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/user.model';

import jwt from 'jsonwebtoken';
import { UserCredentials, UserDetails } from './dto/user.dto';
import { UserService } from '../services/user.service';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request.handler';

const userService = UserService.getInstance();
const router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
    body('name').trim().notEmpty().withMessage('Name must not be empty.'),
    body('surname').trim().notEmpty().withMessage('Surname must not be empty.'),
    body('birthDate').isDate().withMessage('Birth Date must be specified.'),
    body('fiscalCode')
      .toUpperCase()
      .isAlphanumeric()
      .withMessage('Fiscal Code must be alphanumeric'),
    body('fiscalCode')
      .trim()
      .isLength({ min: 16, max: 16 })
      .withMessage('Fiscal Code must be 16 chars long'),
    body('phoneNumber')
      .isMobilePhone(['it-IT', 'en-US'])
      .withMessage('Phone number must be correct'),
    body('userRole').default(UserRole.CUSTOMER),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetails: UserDetails = req.body;
      const user: User = await userService.signup(userDetails);
      const { email } = user;

      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: '4h',
      });

      res.cookie('jwt_encoded', token, {
        maxAge: 4 * 60 * 60 * 1000,
      });

      res.status(201).send({});
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCredentials: UserCredentials = req.body;

      const { email } = await userService.signin(userCredentials);

      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: '4h',
      });

      res.cookie('jwt_encoded', token, {
        maxAge: 4 * 60 * 60 * 1000,
      });

      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

router.post('/signout', async (req: Request, res: Response) => {
  res.clearCookie('jwt_encoded');

  res.status(200).send({});
});

export { router as AuthRouter };
