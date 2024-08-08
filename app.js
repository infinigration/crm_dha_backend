import express from "express";
import { config } from "dotenv";
import cors from "cors";

const app = express();
config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://31.220.18.246:4173",
      "http://localhost:5173",
      "https://infinigration-crm.netlify.app/",
      "https://infinigration-crm.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

import { ErrorMiddleware } from "./middlewares/Error.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());

import authRouter from "./routers/authRouter.js";
import leadRouter from "./routers/leadRouter.js";
import taskRouter from "./routers/taskRouter.js";
import programRouter from "./routers/programRoutes.js";
import contractRouter from "./routers/contractRoutes.js";
import invoiceRouter from "./routers/invoiceRoutes.js";
import processRouter from "./routers/processRouter.js";
import remarkRouter from "./routers/remarkRouter.js";
import clientRouter from "./routers/clientRouter.js";
import vendorRouter from "./routers/vendorRouter.js";
import bankRouter from "./routers/bankRouter.js";
import payrollRouter from "./routers/payrollRouter.js";
import subAgentRouter from "./routers/subAgentRoutes.js";
import otherRouter from "./routers/otherRoutes.js";

app.use("/api/v1", authRouter);
app.use("/api/v1", leadRouter);
app.use("/api/v1", taskRouter);
app.use("/api/v1", programRouter);
app.use("/api/v1", contractRouter);
app.use("/api/v1", invoiceRouter);
app.use("/api/v1", processRouter);
app.use("/api/v1", remarkRouter);
app.use("/api/v1", clientRouter);
app.use("/api/v1", vendorRouter);
app.use("/api/v1", bankRouter);
app.use("/api/v1", payrollRouter);
app.use("/api/v1", subAgentRouter);
app.use("/api/v1", otherRouter);

app.get("/", (req, res) => {
  res.send(`Backend Working`);
});

app.use(ErrorMiddleware);

export default app;
