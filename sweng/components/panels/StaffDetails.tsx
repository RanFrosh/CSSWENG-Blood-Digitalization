"use client"

import { useEffect, useState } from "react";
import { getProfileAction } from "@/actions/profile_action";

const roleNames: Record<string, string> = {
    onsite_admin: "Onsite Admin",
    med_prof: "Medical Professional",
    lab_staff: "Lab Staff",
    recov_staff: "Recovery Staff",
    director: "Red Bank Director",
    super_admin: "Super Admin"
};

export default function StaffDetails() {

    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const result = await getProfileAction();
            if (result.success && result.data) {
                setProfile(result.data);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    if (isLoading) {
        return (
            <section className="mt-[0.15in]">
                <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm animate-pulse">
                    <div className="h-[28px] w-[180px] bg-gray-200 rounded mb-[0.15in]"></div>
                    <div className="mt-[0.15in] flex flex-col gap-[10px]">
                        <div className="h-[20px] w-[250px] bg-gray-200 rounded"></div>
                        <div className="h-[20px] w-[300px] bg-gray-200 rounded"></div>
                        <div className="h-[20px] w-[200px] bg-gray-200 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!profile) {
        return (
            <section className="mt-[0.15in]">
                <div className="bg-white border-2 border-red-300 rounded-[16px] p-[0.25in] shadow-sm text-red-500">
                    <p>Failed to load Staff Details.</p>
                </div>
            </section>
        );
    }

    const displayRole = roleNames[profile.role] || "Staff Member";
    const staffId = `${profile.role.toUpperCase()}-${profile.id.substring(0, 4).toUpperCase()}`;
    const displayName = profile.name || "Unknown User";

    return (
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
                        {displayName}
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
    );
}