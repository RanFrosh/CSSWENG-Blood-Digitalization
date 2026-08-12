import { ApiResponse } from "@/types/api_res_type";
import { CreateCorrections, CreateEventRecords, CreateEvents, ViewCorrectionFilters, ViewCorrections, ViewEventFilters, ViewEventRecords, ViewEvents, ViewEventsWithProvince } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";
import { EventController, EventData } from "@/abstract/events/event_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../utils/access/bouncer";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";

export class ImpEventManager implements EventController {
    private eventModel: EventData
    private profileReader: ProfileSessionProvider

    constructor(injectEventModel: EventData, injectProfileReader: ProfileSessionProvider) {
        this.eventModel = injectEventModel;
        this.profileReader = injectProfileReader;
    }

    async invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>> {

        const res = await helpGateKeep(this.profileReader, 'view_event');

        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const events = await this.eventModel.queryEvent(data, sort);

        return events;
    }

    async invokeQueryAllEvents(): Promise<ApiResponse<ViewEventsWithProvince[]>> {

        const res = await helpGateKeep(this.profileReader, 'view_event');

        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const events = await this.eventModel.queryAllEvents();

        return events;
    }

    async invokeCreateEvent(data: CreateEvents): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'create_event');

        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const creation = await this.eventModel.createEvent(data);
        return creation;
    }

    async invokeQueryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>> {
        const res = await helpGateKeep(this.profileReader, 'view_correct_event');
        
        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const corrections = await this.eventModel.queryCorrection(data, sort);
        return corrections;
    }

    async invokeCreateCorrection(data: Omit<CreateCorrections, 'ref_profile_id'>): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'create_correct_event');
        
        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const appendedData: CreateCorrections = {
            ...data,
            ref_profile_id: res.data.id
        }

        const creation = await this.eventModel.createCorrection(appendedData);
        return creation;
    }

    async invokeQueryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEvents[]>> {
        
        const res = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const securedStaffFilter: ViewAssignedStaffFilter = {
            ...staff,
            staff_id: res.data.id 
        };

        const events = await this.eventModel.queryEventStaff(data, securedStaffFilter);
        
        return events;
    }

    async invokeVerifyEventAccess(event_log_id: bigint): Promise<ApiResponse<ViewEvents>> {

        const res = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const eventResult = await this.eventModel.queryEventById(event_log_id);
        if (!eventResult.success) {
            return { success: eventResult.success, message: eventResult.message, data: undefined };
        }

        return { success: true, message: "Access verified", data: eventResult.data };
    }

    async invokeIsStaffOnOngoingEvent(staff_id: string): Promise<ApiResponse<boolean>> {
        const res = await helpGateKeep(this.profileReader, 'view_event');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.eventModel.isStaffOnOngoingEvent(staff_id);        
    }

    async invokeGetProvince(provinceName: string): Promise<ApiResponse<bigint>> {
        const res = await helpGateKeep(this.profileReader, 'create_event');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.eventModel.getProvince(provinceName);
    }

    async invokeGetCity(cityName: string, provinceId: bigint): Promise<ApiResponse<bigint>> {
        const res = await helpGateKeep(this.profileReader, 'create_event');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.eventModel.getCity(cityName, provinceId);
    }

    async invokeLogEvent(data: Omit<CreateEventRecords, "staff_id">): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'log_event');
        if (!res.success || !res.data)
            return { success: false, message: res.message }

        const appendedData: CreateEventRecords = {
            ...data,
            staff_id: res.data.id
        }
        return await this.eventModel.logEvent(appendedData);        
    }

    async invokeQueryEventRecords(event_log_id: bigint): Promise<ApiResponse<ViewEventRecords[]>> {
        const res = await helpGateKeep(this.profileReader, 'view_log');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.eventModel.queryEventRecords(event_log_id);        
    }
}