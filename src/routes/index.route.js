import { Router } from "express";
import inscriptionsRequestsRouter from "./inscriptionsRequests.route.js";
import eventsRouter from "./events.route.js";
import userRouter from "./users.route.js";
import monthlyPaymentsRouter from "./monthlyPayments.route.js";
import annualPaymentsRouter from "./annualPayments.route.js";
import merchRequestsRouter from "./merchRequests.route.js";
import utilsRouter from "./utils.route.js";

const router = Router();

router.use("/api/events", eventsRouter);
router.use("/api/inscriptions", inscriptionsRequestsRouter);
router.use("/api/users", userRouter);
router.use("/api/monthlypayments", monthlyPaymentsRouter);
router.use("/api/annualpayments", annualPaymentsRouter);
router.use("/api/merchrequests", merchRequestsRouter);
router.use("/api/utils", utilsRouter);

export default router;