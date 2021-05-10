import { DriverLicense } from '../../models/driver-license.model';

export class UpdateUserDto {
  email: string;
  password?: string;
  phoneNumber?: string;
  driverLicense?: DriverLicense;
}
