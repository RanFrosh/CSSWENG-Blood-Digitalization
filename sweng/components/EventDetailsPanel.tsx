import { ViewEvents } from "@/types/event_type";

interface EventDetailsPanelProps {
    event: ViewEvents;
}

export const EventDetailsPanel = ({ event }: EventDetailsPanelProps) => {
    return (
        <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
            
            <div className="flex flex-row items-center justify-between gap-[0.25in] flex-wrap">
                
                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                    {event.name}
                </h2>

                <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                    Event ID: {event.id}
                </span>
            </div>

            <div className="mt-[0.15in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                <p>
                    <span className="font-semibold text-[#002940]">Partner: </span>{" "}
                    {event.partner ? `${event.partner}` : "None"}
                </p>

                <p>
                    <span className="font-semibold text-[#002940]">City: </span>{" "}
                    {event.city}
                </p>

                <p>
                    <span className="font-semibold text-[#002940]">Date: </span>{" "}
                    {event.event_date.split('-').reverse().join('/')}
                </p>

                <p>
                    <span className="font-semibold text-[#002940]">Time: </span>{" "}
                    {event.start_time && event.end_time ? `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}` : "—"}
                </p>
            </div>
        </section>
    );
};