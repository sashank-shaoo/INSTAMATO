const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/foodPartner.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

//Helmet security middleware for setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // disable if using inline styles/scripts
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://instamato.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true, // allow cookies (JWT)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1); // trust first proxy if behind a reverse proxy (e.g., Heroku, Nginx)

// Health check route
app.get("/", (req, res) => {
  res.send("InstaMato backend is running securely 🔒");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
