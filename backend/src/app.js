import express from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/error.middlewares.js"

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// common middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import restaurantRouter from "./routes/restaurant.routes.js"
import menuRouter from "./routes/menu.route.js"
import bookingRouter from "./routes/booking.route.js"
import offerRouter from "./routes/offer.route.js"
import orderRouter from "./routes/order.route.js"

// routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/restaurant", restaurantRouter)
app.use("/api/v1", menuRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1", offerRouter)
app.use("/api/v1", orderRouter)
app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))

app.use(errorHandler)

export { app }