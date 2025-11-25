const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xssSanitize = require("./middlewares/xssSanitize.middlewares");


const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/foodPartner.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

// --------------------- SECURITY MIDDLEWARES ---------------------

// 1) Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2) CORS (must come BEFORE sanitization)
const allowedOrigins = [
  "http://localhost:5173",
  "https://instamato.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3) Body parsing (must come BEFORE sanitize)
app.use(express.json());

// 4) Cookie parser
app.use(cookieParser());

// 5) Prevent MongoDB operator injection
app.use(mongoSanitize({ replaceWith: "_" }));

// 6) Sanitize user input (XSS protection)
app.use(xssSanitize);

// 7) Prevent HTTP Parameter Pollution
app.use(hpp());

// ---------------------------------------------------------------

app.set("trust proxy", 1);

app.get("/", (req, res) => {
  res.send("InstaMato backend is running securely 🔒");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
