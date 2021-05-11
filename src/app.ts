// import './config/db.config';
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { UserRouter } from './controllers/user.controller';
import { AuthRouter } from './controllers/auth.controller';
import { BookingRouter } from './controllers/booking.controller';
import { VehicleRouter } from './controllers/vehicle.controller';
import { errorHandler } from './middlewares/error.handler';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());
app.use(cookieParser());

// Routers
app.use('/auth', AuthRouter);
app.use('/bookings', BookingRouter);
app.use('/vehicles', VehicleRouter);
app.use('/me', UserRouter);

// Middlewares
app.use(errorHandler);

export { app };
