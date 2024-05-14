// /backend/controllers/Coordinates.controllers.js
import { io } from "../server.js";

class CoordinatesController {
  updateCoordinates({ latitude, longitude }) {
    const { latitude, longitude } = req.body;
    try {
      if (!latitude || !longitude) {
        console.error("Latitude and longitude are required");
        return;
      }

      console.log(latitude, longitude);
      // Assuming you want to broadcast the coordinates to all connected clients
      io.emit("coordinatesUpdated", { latitude, longitude });

      console.log("Coordinates updated successfully");
    } catch (error) {
      console.error("Internal server error:", error);
    }
  }
}

export default new CoordinatesController();
