"use client";

import { useRouter, usePathname, useParams } from "next/navigation";

export default function HeaderLS() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const eventId = params?.eventId as string | undefined;
    const donorId = params?.donorId as string | undefined;

    const goMyEvents = () => {
        router.push("/ls/events");
    };

    const goEventHome = () => {
        if (eventId) router.push(`/ls/events/${eventId}`);
    };

    const goQueue = () => {
        if (eventId) router.push(`/ls/events/${eventId}/queue`);
    };

    const goRecord = () => {
        if (eventId && donorId) router.push(`/ls/events/${eventId}/record/${donorId}`);
    };

    const goLogout = () => {
        router.push("/landing");
    };

    const navLinks = [];

    navLinks.push({
        name: "Home",
        path: "/ls/events",
        onClick: goMyEvents,
    });

    if (eventId) {
        navLinks.push({
            name: "Event Home",
            path: `/ls/events/${eventId}`,
            onClick: goEventHome,
        });

        navLinks.push({
            name: "Donation Queue",
            path: `/ls/events/${eventId}/queue`,
            onClick: goQueue,
        });

        if (donorId) {
            navLinks.push({
                name: "Donor Record",
                path: `/ls/events/${eventId}/record/${donorId}`,
                onClick: goRecord,
            });
        }
    }

    const isActiveLink = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="h-[0.75in] border-b-[5px] bg-[#fd5448] border-[#fd5448]">
            <div className="p-[0.125in] gap-[0.5in] flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[0.5in]">
                    <img
                        className="h-[0.5in] w-auto cursor-pointer pl-[0.25in]"
                        src="/images/redbank_onred.png"
                        onClick={goMyEvents}
                        alt="RedBank Logo"
                    />

                    <div className="text-[18px] text-white flex flex-row items-center gap-[0.25in] font-[Montserrat]">
                        {navLinks.map((link) => (
                            <p
                                key={link.path}
                                className={`cursor-pointer hover:text-[#1b4054] ${
                                    isActiveLink(link.path)
                                        ? "font-bold"
                                        : "font-normal"
                                }`}
                                onClick={link.onClick}
                            >
                                {link.name}
                            </p>
                        ))}
                    </div>
                </div>

                <button
                    className="mr-[0.25in] text-[18px] text-white font-[Montserrat] cursor-pointer hover:text-[#1b4054]"
                    onClick={goLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}