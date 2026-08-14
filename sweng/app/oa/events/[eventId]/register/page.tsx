import Header from "@/components/HeaderOA";
import { executeGetAllCities } from "@/app/event_records/event_action";
import RegistrationForm from "./registration-form";
import { checkAuthentication } from "../../action";

export default async function RegisterPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {

    const auth = await checkAuthentication();

    if (!auth.success) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">
                        {auth.message}
                    </p>
                </div>
            </main>
        );
    }

    const citiesRes = await executeGetAllCities();

    if (!citiesRes.success || !citiesRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">
                        {citiesRes.message}
                    </p>
                </div>
            </main>
        );
    }

    const cities = citiesRes.data;

    const { eventId } = await params;
    
    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[16px] font-['Montserrat'] text-[#002940]">
                        Onsite Admin
                    </p>
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Registration
                    </h1>
                </section>

                <RegistrationForm
                    eventId={eventId}
                    cities={cities}
                />
  
            </div>
        </main>
    );
    
}
