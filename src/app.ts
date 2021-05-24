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
import fileUpload from 'express-fileupload';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    preserveExtension: 4,
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached (max 10 Mb)',
    limits: { fileSize: 10 * 1024 * 1024 },
    uploadTimeout: 60000,
    debug: true,
  })
);

// Routers
app.use('/auth', AuthRouter);
app.use('/bookings', BookingRouter);
app.use('/vehicles', VehicleRouter);
app.use('/me', UserRouter);

// Middlewares
app.use(errorHandler);

export { app };
