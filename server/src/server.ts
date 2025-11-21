import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import cookieParser from "cookie-parser";

import { authRouter } from "./api/auth/auth.routes";
import { busStationRouter } from "./api/bus_station/bus_station.routes";
import { provinceRouter } from "./api/province/province.routes";
import { busOperatorRouter } from "./api/bus_operator/bus_operator.routes";
import { busRouter } from "./api/bus/bus.routes";
import { routeRouter } from "./api/route/route.routes";
import { routeStopRouter } from "./api/route_stop/route_stop.routes";
import { seatRouter } from "./api/seat/seat.routes";
import { tripRouter } from "./api/trip/trip.routes";
import { bookingRouter } from "./api/booking/booking.routes";
import { paymentRouter } from "./api/payment/payment.routes";

// import Routes
import { userRouter } from "@/api/user/user.routes";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Cookies
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes 
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter); //
app.use("/auth", authRouter); // 
app.use("/bus_stations", busStationRouter); //
app.use("/provinces", provinceRouter); //
app.use("/bus_operators", busOperatorRouter); //
app.use('/buses', busRouter); //
app.use("/routes", routeRouter);
app.use("/route_stops", routeStopRouter);
app.use("/seats", seatRouter);
app.use("/trips", tripRouter);
app.use("/bookings", bookingRouter);
app.use("/payments", paymentRouter);


// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
