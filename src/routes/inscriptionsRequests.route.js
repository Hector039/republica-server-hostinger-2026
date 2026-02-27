import { Router } from "express";
import InscriptionsRequestsController from "../controllers/inscriptionsRequests.controller.js";
import { inscriptionsRequestsService, usersService, eventsService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const inscriptionRequestController = new InscriptionsRequestsController(inscriptionsRequestsService, usersService, eventsService)
const router = Router();

router.param("iid", inscriptionRequestController.param);
router.get("/newrequests", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.getNewInscriptionRequests);
router.get("/updatenewrequests", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.updateSeenNewInscriptionRequests);
router.post("/", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getInscriptionsRequests);
router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getUserInscriptionRequest);
router.get("/alluserinscriptions/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getAllUserInscriptions);
router.get("/getdebtorshistory/:day/:group", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.getDebtorsHistory);
router.post("/addinscpayment", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.addInscPayment);//agregar pago parcial
router.put("/", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.updateInscriptionRequest);//saldar inscripción
router.post("/addinscrequest/:eid/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.addInscriptionRequest);
router.delete("/:iid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.deleteInscriptionRequest);

export default router;
