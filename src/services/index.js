import EventsService from "./events.service.js";
import MerchRequestsService from "./merchRequests.service.js";
import InscriptionsRequestsService from "./inscriptionsRequests.service.js";
import UsersService from "./users.service.js";
import MonthlyPaymentsService from "./monthlyPayments.service.js";
import AnnualPaymentsService from "./annualPayments.service.js";
import UtilsService from "./utils.service.js";

import { eventsRepository, merchRequestsRepository, inscriptionsRequestsRepository, usersRepository, monthlyPaymentsRepository, annualPaymentsRepository, utilsRepository } from '../dao/repository/index.js';

const eventsService = new EventsService(eventsRepository);
const merchRequestsService = new MerchRequestsService(merchRequestsRepository);
const inscriptionsRequestsService = new InscriptionsRequestsService(inscriptionsRequestsRepository);
const usersService = new UsersService(usersRepository);
const monthlyPaymentsService = new MonthlyPaymentsService(monthlyPaymentsRepository);
const annualPaymentsService = new AnnualPaymentsService(annualPaymentsRepository);
const utilsService = new UtilsService(utilsRepository);

export { eventsService, merchRequestsService, inscriptionsRequestsService, usersService, monthlyPaymentsService, annualPaymentsService, utilsService };