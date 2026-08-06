import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import consultationRouter from './routes/consultationRoutes.js';
import vitalsRouter from './routes/vitalsRoutes.js';
import labOrdersrouter from './routes/lab_ordersRoutes.js';
import { errorHandler } from './middlewares/errorHandlers.js';

const app = express()

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'emr_cookie_secret'));
app.use('/uploads', express.static('uploads'));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'emr_secret_key',
        resave: false,
        saveUninitialized:false,
        cookie:{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);

//ROUTES
app.use('/api/consultation', consultationRouter);
app.use('/api/labOrders', labOrdersrouter);
app.use('/api/vitals', vitalsRouter);

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.statusCode = 404;
    next(error); // Passes error straight to errorHandler
});

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;



