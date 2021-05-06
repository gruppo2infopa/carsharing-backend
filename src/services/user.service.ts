import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User, UserRole } from '../models/user.model';

class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  signup(userDetails: UserDetails): User {
    const {
      email,
      password,
      name,
      surname,
      birthDate,
      fiscalCode,
      phoneNumber,
      driverLicense,
    } = userDetails;

    // TODO: rendere il valore di customer come default e non hardcoded
    const userRole = UserRole.CUSTOMER;

    const user: User = {
      id: 0,
      email,
      password,
      name,
      surname,
      birthDate,
      fiscalCode,
      phoneNumber,
      userRole,
      driverLicense,
    };

    return user;
  }

  signin(userCredentials: UserCredentials): User {
    const { email, password } = userCredentials;

    const user: User = {
      id: 0,
      email,
      password,
      name: '',
      surname: '',
      birthDate: new Date(),
      fiscalCode: '',
      phoneNumber: '',
      userRole: UserRole.CUSTOMER,
    };

    return user;
  }
}

export { UserService };
