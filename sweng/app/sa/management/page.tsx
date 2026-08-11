"use client";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";

// Sample user structure
type User = {
    id: string;
    name: string;
    role: string;
}

// Sample SA user
const SAUser: User = {
    id: "SA-001",
    name: "Jordan Doe",
    role: "Super Admin",
}

export default function AnalyticsPage() {
    const router = useRouter();

    const goEventMng = () => {
        router.push(`/sa/management/events`);
    };

    const goUserMng = () => {
        router.push(`/sa/management/users`);
    };

    const goEventLog = () => {
        router.push(`/sa/management/logs/events`);
    };

    const goRequests = () => {
        router.push("/sa/management/requests");
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Welcome, {SAUser.name}!
                    </h1>
                </section>

                {/* Staff Details */}
                <section className="mt-[0.15in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Staff Details
                        </h2>

                        <div className="mt-[0.15in] flex flex-col gap-[5px] text-[18px]">
                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Name:
                                </span>{" "}
                                {SAUser.name}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Role:
                                </span>{" "}
                                {SAUser.role}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Staff ID:
                                </span>{" "}
                                {SAUser.id}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Action Cards */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Actions
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                        <button
                            onClick={goEventMng}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[20px] font-['Montserrat'] font-bold">
                                Manage Events
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                Manage event database.
                            </p>
                        </button>

                        <button
                            onClick={goUserMng}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[20px] font-['Montserrat'] font-bold">
                                Manage Users
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                Manage user database.
                            </p>
                        </button>

                        <button
                            onClick={goEventLog}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[20px] font-['Montserrat'] font-bold">
                                View Event Logs
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                View real-time event updates.
                            </p>
                        </button>

                        <button
                            onClick={goRequests}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[20px] font-['Montserrat'] font-bold">
                                Review Edit Requests
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                Review submitted edit requests.
                            </p>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}