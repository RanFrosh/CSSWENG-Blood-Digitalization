import Header from "@/components/HeaderSA";
import RequestsClient from "./client";
import { redirect } from "next/navigation";
import { getEditRequestsAction } from "@/actions/sa_action";
import { fetchSACurrentUser } from "@/actions/sa_action";

export default async function SARequestsPage() {

    const authRes = await fetchSACurrentUser();

    if (!authRes.success || !authRes.data) {
        redirect("/landing");
    }
    
    const activeAdminId = authRes.data.id;

    const response = await getEditRequestsAction();
    const dbRequests = response.success && response.data ? response.data : [];

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <RequestsClient initialRequests={dbRequests} currentAdminId={activeAdminId}/>
        </main>
    );
}