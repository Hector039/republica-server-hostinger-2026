import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export default class EventsController {
    constructor(eventsService, usersService) {
        this.eventsService = eventsService;
        this.usersService = usersService;
    }

    getEvent = async (req, res, next) => {//get
        const { eid } = req.params;
        try {
            const event = await this.eventsService.getEvent(eid);
            if (!event.length) {
                CustomError.createError({
                    message: `Evento ID: ${eid} no encontrado.`,
                    code: TErrors.NOT_FOUND
                });
            };
            res.status(200).send(event[0]);
        } catch (error) {
            next(error)
        }
    }

    getEvents = async (req, res, next) => {
        try {
            const events = await this.eventsService.getEvents();
            if (!events.length) {
                return res.status(200).send(events);
            };
            if (!events) {
                CustomError.createError({
                    message: `Error de base de datos.`,
                    code: TErrors.DATABASE
                });
            };
            res.send(events).status(200);
        } catch (error) {
            next(error)
        }
    }

    deleteEvent = async (req, res, next) => {//delete
        const { eid } = req.params;
        try {
            await this.eventsService.deleteEvent(eid);
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

    deleteAllEvents = async (req, res, next) => {
        try {
            await this.eventsService.deleteAllEvents();
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

    updateEvent = async (req, res, next) => {
        const { eid } = req.params;
        const { event_date, event_name, event_description, inscription_price, group_list } = req.body;
        try {
            if (!event_date || !event_name || !event_description) {
                CustomError.createError({
                    message: `Faltan datos.`,
                    code: TErrors.INVALID_TYPES,
                });
            }

            const event = await this.eventsService.getEvent(eid);

            if (!event.length) {
                CustomError.createError({
                    message: `Evento ID: ${eid} no encontrado.`,
                    code: TErrors.NOT_FOUND
                });
            };

            const updatedEvent = await this.eventsService.updateEvent(eid, { event_date, event_name, event_description, inscription_price, group_list });

            res.status(200).send(updatedEvent);
        } catch (error) {
            next(error)
        }
    }

    addEvent = async (req, res, next) => {
        const { event_date, event_name, event_description, inscription_price, group_list } = req.body;
        try {
            if (!event_date || !event_name || !event_description) {
                CustomError.createError({
                    message: `Faltan datos.`,
                    code: TErrors.INVALID_TYPES,
                });
            }

            const event = await this.eventsService.addEvent({ event_date, event_name, event_description, inscription_price, group_list });

            res.status(200).send(event);
        } catch (error) {
            next(error)
        }
    }

}
