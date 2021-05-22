import request from 'supertest';
import { app } from '../../app';
import { User, UserRole } from '../../models/user.model';
import { UserDetails } from '../dto/user.dto';

const fakeCustomer: User = {
  email: 'prova@gmail.com',
  password: 'password',
  name: 'nome',
  surname: 'cognome',
  birthDate: new Date('2002-10-4'),
  fiscalCode: 'GHYCASGHYCASGHYC',
  phoneNumber: '0918173459',
  bookings: [],
  creditCards: [],
  hasVerifiedEmail: true,
  verifyCode: 'abcd',
  role: UserRole.CUSTOMER,
};

describe('User Authentication', () => {
  test('Should signup the user', async () => {
    const newUser = fakeCustomer;
    newUser.hasVerifiedEmail = false;

    await request(app)
      .post('/auth/signup')
      .send(newUser as UserDetails)
      .expect('Content-Type', 'application/json')
      .expect(201);
  });
});

/*describe('User Authentication', () => {
  const validUser = {
    email: 'luca.bianchi@gmail.com',
    password: 'lucabianchi',
    name: 'Luca',
    surname: 'Bianchi',
    birthDate: '1980-12-12',
    fiscalCode: 'LCB27BSBSBSBSBSB',
    phoneNumber: '3333333333',
  };

  const invalidUser = {
    email: 'luca.bianchi@gmail.com',
    password: 'lucabianchi',
    name: 'Luca',
    surname: 'Bianchi',
    birthDate: '1980-12-12',
    phoneNumber: '3333333333',
  };

  const validCredentials = {
    email: 'luca.bianchi@gmail.com',
    password: 'lucabianchi',
  };

  const invalidCredentials = {
    email: 'luca.bianchi@gmail.com',
    password: 'lucaBianchi',
  };

  it('Create correctly a user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validUser)
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('User creation without fiscal code failing', async () => {
    await request(app).post('/auth/signup').send({}).expect(400);

    const response = await request(app)
      .post('/auth/signup')
      .send(invalidUser)
      .expect(400);

    expect(response.get('Set-Cookie')).not.toBeDefined();
  });

  it('Users correctly logs in', async () => {
    await request(app).post('/auth/signup').send(validUser);

    const response = await request(app)
      .post('/auth/signin')
      .send(validCredentials)
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('User attempts login with invalid credentials', async () => {
    await request(app).post('/auth/signup').send(validUser);

    await request(app).post('/auth/signin').send({}).expect(400);

    const response = await request(app)
      .post('/auth/signin')
      .send(invalidCredentials)
      .expect(401);

    expect(response.get('Set-Cookie')).not.toBeDefined();
  });

  // TODO: Add test for creation of Employee (check UserRole of Company Administrator)
});*/
