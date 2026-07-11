"use client";

import { useRouter, usePathname, useParams } from "next/navigation";

export default function HeaderOA() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const eventId = params?.eventId as string | undefined;

    const goMyEvents = () => {
        router.push("/oa/events");
    };

    const goEventHome = () => {
        if (eventId) router.push(`/oa/events/${eventId}`);
    };

    const goRegisterDonor = () => {
        if (eventId) router.push(`/oa/events/${eventId}/register`);
    };

    const goScanner = () => {
        if (eventId) router.push(`/oa/events/${eventId}/scanner`);
    };

    const goSearch = () => {
        if (eventId) router.push(`/oa/events/${eventId}/search`)
    }

    const goLogout = () => {
        router.push("/landing");
    };

    const navLinks = eventId
        ? [
              {
                  name: "Home",
                  path: "/oa/events",
                  onClick: goMyEvents,
              },
              {
                  name: "Event Home",
                  path: `/oa/events/${eventId}`,
                  onClick: goEventHome,
              },
              {
                  name: "Search Donor",
                  path: `/oa/events/${eventId}/search`,
                  onClick: goSearch,
              },
              {
                  name: "Register Donor",
                  path: `/oa/events/${eventId}/register`,
                  onClick: goRegisterDonor,
              },
              {
                  name: "Scan QR",
                  path: `/oa/events/${eventId}/scanner`,
                  onClick: goScanner,
              }
          ]
        : [
              {
                  name: "Home",
                  path: "/oa/events",
                  onClick: goMyEvents,
              },
          ];

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
                                    isActiveLink(link.path) ? "font-bold" : "font-normal"
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