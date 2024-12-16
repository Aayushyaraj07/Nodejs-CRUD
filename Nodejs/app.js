require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const authRouter = require("./route/authRoute.js");
const projectRouter = require("./route/projectRoute.js");
const userRouter = require("./route/userRoute.js");
const catchAsync = require("./utils/catchAsync.js");
const cors = require("cors");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controller/errorController.js");

const app = express();

app.use(express.json());


app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow multiple origins if needed by adding more URLs to the array
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // If your app requires cookies or authorization headers
  })
);


//all routes will be here"
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log("Server up and running!", PORT);
});
