import { DriverLicense } from './driver-license.model';

interface User {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: Date;
  fiscalCode: string;
  phoneNumber: string;
  userRole: UserRole;
  driverLicense?: DriverLicense;
}

enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ATTENDANT = 'ATTENDANT',
  COMPANY_ADMINISTRATOR = 'COMPANY_ADMINISTRATOR',
}

export { User, UserRole };
