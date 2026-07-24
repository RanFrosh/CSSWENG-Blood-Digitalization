import { ViewEvents } from "@/types/event_type";

interface EventCardProps {
    event: ViewEvents;
    actionButton?: React.ReactNode;
}

export const EventCard = ({ event, actionButton }: EventCardProps) => {
    return (
        <div className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
            {/* Event Header */}
            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[0.15in]">
                    <h2 className="text-[24px] font-['Montserrat'] font-bold">
                        {event.name}
                    </h2>
                    <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                        {event.status}
                    </span>
                </div>
                {actionButton}
            </div>

            {/* Event Details */}
            <div className="p-[0.35in]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">

                    <p>
                        <span className="font-semibold text-[#002940]">Partner: </span> 
                        {event.partner}
                    </p>
                    
                    <p>
                        <span className="font-semibold text-[#002940]">Street: </span> 
                        {event.street}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Date: </span> 
                        {event.event_date.split('-').reverse().join('/')}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Time: </span>{" "}
                        {event.start_time && event.end_time ? `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}` : "—"}
                    </p>

                </div>
            </div>
        </div>
    );
};