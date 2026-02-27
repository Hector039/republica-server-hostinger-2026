import { Router } from "express";
import MerchRequestsController from "../controllers/merchRequests.controller.js";
import { merchRequestsService, usersService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const merchRequestsController = new MerchRequestsController(
	merchRequestsService,
	usersService,
);
const router = Router();

router.param("uid", merchRequestsController.param);
router.get(
	"/newrequests",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.getNewMerchRequests,
);
router.get(
	"/updatenewrequests",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.updateSeenNewMerchRequests,
);
router.post(
	"/",
	userPassJwt(),
	handlePolicies(["PUBLIC"]),
	merchRequestsController.getMerchRequests,
);
router.get(
	"/allusermerch/:uid",
	userPassJwt(),
	handlePolicies(["PUBLIC"]),
	merchRequestsController.getAllUserMerchRequest,
);
router.get(
	"/getdebtorshistory/:day/:group",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.getDebtorsHistory,
);
router.get(
	"/merchrequestbyid/:mid",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.getMerchRequestById,
);
router.put(
	"/updatepaymentstatus/",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.updateMerchPayment,
); //Saldar
router.delete(
	"/:mid",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.deleteMerchRequest,
);
router.post(
	"/addmerchrequest/:uid/:pid",
	userPassJwt(),
	handlePolicies(["PUBLIC"]),
	merchRequestsController.addMerchRequest,
);
router.post(
	"/addmerchpayment",
	userPassJwt(),
	handlePolicies(["ADMIN"]),
	merchRequestsController.addMerchPayment,
); //agregar pago parcial de merch
router.get(
	"/:uid",
	userPassJwt(),
	handlePolicies(["PUBLIC"]),
	merchRequestsController.getUserMerchRequest,
);

export default router;
