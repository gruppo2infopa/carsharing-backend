import { Router, Request, Response } from 'express';
import { UserRole } from '../models/user.model';

import jwt from 'jsonwebtoken';
import { UserCredentials, UserDetails } from './dto/user.dto';
import { userService } from '../services/user.service';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request.handler';
import { requireAuth } from '../middlewares/require-auth.handler';

// TODO: estrarre in un modulo a parte?
const COOKIE_NAME: string = 'jwt_encoded';
const TOKEN_MAX_AGE: number = 4 * 60 * 60 * 1000; // 4h

function setResponseToken(res: Response, tokenPayload: object) {
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
    expiresIn: TOKEN_MAX_AGE,
  });

  res.cookie(COOKIE_NAME, token, {
    maxAge: TOKEN_MAX_AGE,
  });
}
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
    body('role').default(UserRole.CUSTOMER).equals(UserRole.CUSTOMER),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const userDetails: UserDetails = req.body;
    const { email, role } = await userService.signup(userDetails);

    setResponseToken(res, { email, role });
    res.status(201).send({});
  }
);

router.post(
  '/signup/employee',
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
      .trim()
      .toUpperCase()
      .isAlphanumeric()
      .withMessage('Fiscal Code must be alphanumeric')
      .isLength({ min: 16, max: 16 })
      .withMessage('Fiscal code must be 16 chars long'),
    body('phoneNumber')
      .isMobilePhone(['it-IT', 'en-US'])
      .withMessage('Phone number must be correct'),
    body('role').isIn([
      UserRole.COMPANY_ADMINISTRATOR,
      UserRole.ATTENDANT,
      UserRole.DRIVER,
    ]),
  ],
  validateRequest,
  requireAuth([UserRole.COMPANY_ADMINISTRATOR]),
  async (req: Request, res: Response) => {
    const userDetails: UserDetails = req.body;
    await userService.signup(userDetails);

    res.status(201).send({});
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
  async (req: Request, res: Response) => {
    const userCredentials: UserCredentials = req.body;
    const { email, role } = await userService.signin(userCredentials);

    setResponseToken(res, { email, role });
    res.status(200).send({});
  }
);

router.post('/signout', async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).send({});
});

export { router as AuthRouter };
