import Header from "@/components/HeaderOA";
import { orm } from "@/db/drizzle";
import { city } from "@/db/models/city";
import { province } from "@/db/models/province";
import RegistrationForm from "./registration-form";
import { checkAuthentication } from "../../oa_action";

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

    const provinces = await orm.select().from(province);
    const cities = await orm.select().from(city);

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

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div>
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donor Information
                        </h2>
                    </div>

                <RegistrationForm
                    eventId={eventId}
                    provinces={provinces}
                    cities={cities}
                />
                    
                </section>
            </div>
        </main>
    );
    
}
