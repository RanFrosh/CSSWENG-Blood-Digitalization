import { ApiResponse } from "@/types/api_res_type";
import { CreateCorrections, CreateEvents, ViewCorrectionFilters, ViewCorrections, ViewEventFilters, ViewEvents } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";
import { EventController, EventData } from "@/abstract/events/event_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../global/helper_bouncer/bouncer";

export class ImpEventManager implements EventController {
    private eventModel: EventData
    private profileReader: ProfileSessionProvider

    constructor(injectEventModel: EventData, injectProfileReader: ProfileSessionProvider) {
        this.eventModel = injectEventModel;
        this.profileReader = injectProfileReader;
    }

    async invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>> {
        const res = await helpGateKeep(this.profileReader, 'view_event');
        if (!res.success) return { success: false, message: res.message, data: res.data }
        const events = await this.eventModel.queryEvent(data, sort);
        return events;
    }

    async invokeCreateEvent(data: CreateEvents): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'create_event');
        if (!res.success) return { success: false, message: res.message, data: res.data }
        const creation = await this.eventModel.createEvent(data);
        return creation;
    }

    async invokeQueryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>> {
        const res = await helpGateKeep(this.profileReader, 'view_correct_event');
        if (!res.success) return { success: false, message: res.message, data: res.data }
        const corrections = await this.eventModel.queryCorrection(data, sort);
        return corrections;
    }

    async invokeCreateCorrection(data: CreateCorrections): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'create_correct_event');
        if (!res.success) return { success: false, message: res.message, data: res.data }
        const creation = await this.eventModel.createCorrection(data);
        return creation;
    }
}