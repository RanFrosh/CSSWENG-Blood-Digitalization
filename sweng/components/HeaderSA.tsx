"use client";

import { useRouter, usePathname } from "next/navigation";

type NavLink = {
    name: string;
    path: string;
    onClick: () => void;
};

export default function HeaderSA() {
    const router = useRouter();
    const pathname = usePathname();

    const goHome = () => {
        router.push("/sa/management");
    };

    const goMyProfile = () => {
        router.push("/sa/profile");
    };

    const goEventMng = () => {
        router.push(`/sa/management/events`);
    };

    const goUserMng = () => {
        router.push("/sa/management/users");
    };

    const goEventLog = () => {
        router.push(`/sa/management/logs/events`);
    };

    const goDataLog = () => {
        router.push(`/sa/management/logs/data`);
    };

    const goLogout = () => {
        router.push("/landing");
    };

    const navLinks: NavLink[] = [
        {
            name: "Home",
            path: "/sa/management",
            onClick: goHome,
        },
        {
            name: "Profile",
            path: "/sa/profile",
            onClick: goMyProfile,
        },
        {
            name: "Event Management",
            path: "/sa/management/events",
            onClick: goEventMng,
        },
        {
            name: "User Management",
            path: "/sa/management/users",
            onClick: goUserMng,
        },
        {
            name: "Event Logs",
            path: "/sa/management/logs/events",
            onClick: goEventLog,
        },
        {
            name: "Database Logs",
            path: "/sa/management/logs/data",
            onClick: goDataLog,
        },
    ];

    const isActiveLink = (path: string) => {
        if (path === "/sa/management") {
            return pathname === path;
        } else {
            return pathname.startsWith(path);
        }
    };

    return (
        <div className="h-[0.75in] border-b-[5px] bg-[#fd5448] border-[#fd5448]">
            <div className="p-[0.125in] gap-[0.5in] flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[0.5in]">
                    <img
                        className="h-[0.5in] w-auto cursor-pointer pl-[0.25in]"
                        src="/images/redbank_onred.png"
                        onClick={goHome}
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