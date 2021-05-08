import { User, UserRole } from '../../models/user.model';
import { UserModel } from '../../repositories/models/user.db.model';

describe('User Authentication', () => {
  it('Create correctly a user', async () => {
    // console.log('[test]', DbConfig.getSequelizeInstance());

    const user: User = {
      email: 'luca.bianchi@gmail.com',
      password: 'lucabianchi',
      name: 'Luca',
      surname: 'Bianchi',
      birthDate: new Date(),
      fiscalCode: 'LCB27BSBSBSBSBSB',
      userRole: UserRole.CUSTOMER,
      phoneNumber: '3333333333',
    };

    const newUser = await UserModel.create(user);
  });
});
