import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './controllers/auth.controller';
import { BookingRouter } from './controllers/booking.controller';
import { VehicleRouter } from './controllers/vehicle.controller';
import { errorHandler } from './middlewares/error.handler';
import { DbConfig } from './config/db.config';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());
app.use(cookieParser(undefined, {}));

// Routers
app.use('/auth', AuthRouter);
app.use('/bookings', BookingRouter);
app.use('/vehicles', VehicleRouter);

// Middlewares
app.use(errorHandler);

export { app };
