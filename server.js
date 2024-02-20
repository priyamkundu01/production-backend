// /backend/server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet"; // Added helmet for security headers
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from "./configs/MongoDB.config.js";
import coordinatesController from "./controllers/Coordinates.controllers.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import adminRoutes from "./routes/Admins.routes.js";
import areaRoutes from "./routes/Areas.routes.js";
import assignRoutes from "./routes/Assigns.routes.js";
import coordinatesRoutes from "./routes/Coordinates.routes.js";
import driverRoutes from "./routes/Drivers.routes.js";
import dustbinRoutes from "./routes/Dustbins.routes.js";
import userRoutes from "./routes/Users.routes.js";
import vehicleRoutes from "./routes/Vehicles.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://garbagevehicletracker.github.io",
      "https://municipality-garbage-tracking.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("coordinatesUpdated", (data) => {
    console.log("Received coordinates:", data);
    coordinatesController.updateCoordinates(data); // Call the controller function to handle the coordinates
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// Use helmet for security headers
app.use(helmet());

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://municipality-garbage-tracking.onrender.com",
      "https://garbagevehicletracker.github.io",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// ...

const port = process.env.PORT || 5500;

connectToMongoDB();

// Body parser middleware
app.use(express.json());

// Use your routes
app.get("/", (req, res) => {
  res.send("My server is listening from ec2 in port 5500, and it is successfully deployed");
});

app.use("/areas", authMiddleware, areaRoutes);
app.use("/dustbins", authMiddleware, dustbinRoutes);
app.use("/vehicles", authMiddleware, vehicleRoutes);
app.use("/drivers", authMiddleware, driverRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/work", authMiddleware, assignRoutes);
app.use("/coordinates", coordinatesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

export { io }; // Export io for WebSocket usage in controllers
