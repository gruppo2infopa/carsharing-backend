import { DriverLicense } from './driver-license.model';

class User {
  constructor(
    public email: string,
    public password: string,
    public name: string,
    public surname: string,
    public birthDate: Date,
    public fiscalCode: string,
    public phoneNumber: string,
    public userRole: UserRole,
    public driverLicense?: DriverLicense
  ) {}
}

enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ATTENDANT = 'ATTENDANT',
  COMPANY_ADMINISTRATOR = 'COMPANY_ADMINISTRATOR',
}

export { User, UserRole };
