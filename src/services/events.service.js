export default class EventsService {
    constructor(repository) {
        this.eventRepo = repository;
    }

    async getEvent(eid) {
        try {
            const event = await this.eventRepo.getEvent(eid);
            return event;
        } catch (error) {
            throw error;
        }
    };

    async getEvents() {
        try {
            const events = await this.eventRepo.getEvents();
            return events;
        } catch (error) {
            throw error;
        }
    };

    async addEvent(event) {
        try {
            const newEvent = await this.eventRepo.addEvent(event)
            return newEvent;
        } catch (error) {
            throw error;
        }
    };

    async updateEvent(eid, eventData) {
        try {
            await this.eventRepo.updateEvent(eid, eventData)
            return;
        } catch (error) {
            throw error;
        }
    };

    async deleteAllEvents() {
        try {
            await this.eventRepo.deleteAllEvents()
            return;
        } catch (error) {
            throw error;
        }
    };

    async deleteEvent(eid) {
        try {
            await this.eventRepo.deleteEvent(eid);
            return;
        } catch (error) {
            throw error;
        }
    };
};