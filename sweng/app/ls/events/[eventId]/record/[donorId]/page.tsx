import { redirect } from "next/navigation";
import { checkExtractionAccessAction } from "../../../ls_action"; // Adjust path if needed
import RecordClient from "./client";
import Header from "@/components/HeaderLS";

export default async function RecordPage({
    params,
}: {
    params: { eventId: string; donorId: string };
}) {
    const resolvedParams = await params;
    const { eventId, donorId } = resolvedParams;

    if (!eventId || !donorId) {
        redirect("/ls/events");
    }

    const access = await checkExtractionAccessAction(eventId, donorId);

    if (!access.authorized) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header/>
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            {access.message || "Access Denied"}
                        </p>
                        <p className="mt-2 text-[16px] text-[#5c6b73]">
                            You do not have permission to view or submit this extraction record.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return <RecordClient />;
}