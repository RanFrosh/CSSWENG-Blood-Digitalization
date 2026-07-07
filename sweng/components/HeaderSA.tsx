"use client";

import { useRouter, usePathname, useParams } from "next/navigation";

export default function HeaderSA() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const eventId = params?.eventId as string | undefined;

    const goMyEvents = () => {
        router.push("/sa/events");
    };

    const goEventHome = () => {
        if (eventId) router.push(`/sa/events/${eventId}`);
    };

    const goManageUsers = () => {
        router.push("/sa/users");
    };

    const goLogout = () => {
        router.push("/landing");
    };

    const navLinks = eventId
        ? [
              {
                  name: "Manage Events",
                  path: "/sa/events",
                  onClick: goMyEvents,
              },
              {
                  name: "Event Home",
                  path: `/sa/events/${eventId}`,
                  onClick: goEventHome,
              },
              {
                  name: "Manage Users",
                  path: "/sa/users",
                  onClick: goManageUsers,
              },
          ]
        : [
              {
                  name: "Manage Events",
                  path: "/sa/events",
                  onClick: goMyEvents,
              },
              {
                  name: "Manage Users",
                  path: "/sa/users",
                  onClick: goManageUsers,
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
                                className={`cursor-pointer hover:scale-110 ${
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
                    className="mr-[0.25in] text-[18px] text-white font-[Montserrat] cursor-pointer hover:scale-110 hover:underline"
                    onClick={goLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}