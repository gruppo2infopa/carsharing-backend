import { DriverLicense } from '../../models/driver-license.model';
import { UserRole } from '../../models/user.model';

interface UserDetails {
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

interface UserCredentials {
  email: string;
  password: string;
}

export { UserDetails, UserCredentials };
