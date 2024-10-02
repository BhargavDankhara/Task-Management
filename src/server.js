import express from "express";

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import { ENV_CONGIG } from "./config/env.config.js";
import { connectDB } from "./config/db.js";

const app = express();

// ENV_CONGIG.PORT is set in.env file
const PORT = ENV_CONGIG.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes); //user route
app.use("/api/auth", taskRoutes); //task route

app.listen(PORT, (err) => {
  //   if (err) {
  //     console.log(err, "server is not Connected");
  //   }
  console.log("listening on port http://localhost:" + PORT);
  connectDB();
});
