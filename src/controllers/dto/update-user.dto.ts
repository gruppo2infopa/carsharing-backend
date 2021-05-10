import { DriverLicense } from '../../models/driver-license.model';

export interface UpdateUserDto {
  email: string;
  password?: string;
  phoneNumber?: string;
  driverLicense?: DriverLicense;
}
