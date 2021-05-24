import { CreditCard } from '../../models/credit-card.model';
import { DriverLicense } from '../../models/driver-license.model';
import { UserRole } from '../../models/user.model';

export class UserDetails {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: Date;
  fiscalCode: string;
  phoneNumber: string;
  role: UserRole;
  driverLicense?: DriverLicense;
}

export class UserCredentials {
  email: string;
  password: string;
}

export class UpdateUserDto {
  password?: string;
  phoneNumber?: string;
  driverLicense?: DriverLicense;
  creditCard?: CreditCard;
}
