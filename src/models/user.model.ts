import { DriverLicense } from './driver-license.model';

interface User {
  id: number;
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
  CUSTOMER,
  DRIVER,
  ATTENDANT,
  COMPANY_ADMINISTRATOR,
}

export { User, UserRole };
