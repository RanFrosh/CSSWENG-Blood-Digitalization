"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Header from "@/components/HeaderSA";
import { fetchSACurrentUser } from "@/actions/sa_action";
import { ReadProfile } from "@/types/profile_type";

const roleNames: Record<string, string> = {
    super_admin: "Super Admin",
};

export default function AnalyticsPage() {
    const router = useRouter();

    const [profile, setProfile] = useState<ReadProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setErrorMessage("");
            const result = await fetchSACurrentUser();
            if (result.success && result.data) {
                setProfile(result.data);
            } else {
                setErrorMessage(result.message);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, []);

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

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading profile...</p>
                </div>
            </main>
        );
    }

    if (errorMessage || !profile) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{errorMessage || "Profile not found"}</p>
                </div>
            </main>
        );
    }

    const staffId = `${profile.role.toUpperCase()}-${profile.id.substring(0, 4).toUpperCase()}`;
    const displayRole = roleNames[profile.role] || profile.role;

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Welcome, {profile.name}!
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
                                {profile.name}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Role:
                                </span>{" "}
                                {displayRole}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Staff ID:
                                </span>{" "}
                                {staffId}
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
                                View event updates.
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