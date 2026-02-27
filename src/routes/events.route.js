import { Router } from "express";
import EventsController from "../controllers/events.controller.js";
import { eventsService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const eventsController = new EventsController(eventsService);
const router = Router();

router.get("/:eid", userPassJwt(), handlePolicies(["PUBLIC"]), eventsController.getEvent);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), eventsController.getEvents);
router.delete("/:eid", userPassJwt(), handlePolicies(["ADMIN"]), eventsController.deleteEvent);
router.delete("/", userPassJwt(), handlePolicies(["ADMIN"]), eventsController.deleteAllEvents);
router.put("/:eid", userPassJwt(), handlePolicies(["ADMIN"]), eventsController.updateEvent);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), eventsController.addEvent);

export default router;