import { Router } from "express";
import MothlyPaymentsController from "../controllers/mothlyPayments.controller.js";
import { monthlyPaymentsService, usersService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const mothlyPaymentsController = new MothlyPaymentsController(monthlyPaymentsService, usersService)
const router = Router();

router.get("/fullmonthlyhistory/:uid", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.getFullHistoryPayments);
router.get("/:month/:year/:group", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.getDebtorsHistory);
router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), mothlyPaymentsController.getHistoryPayments);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.addPayment);
router.post("/linkedpayment/", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.addLinkedPayment);

router.get("/notifydebtor/:uid/:date", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.notifyDebtor);
router.get("/userdebthistory/:uid", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.getUserDebtHistory);

router.delete("/delmonthlypayment/:mid/:paydate", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.deleteMonthlyPayment);

export default router;
