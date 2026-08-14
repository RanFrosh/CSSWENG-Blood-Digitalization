"use client";
import { useRouter, usePathname } from "next/navigation";
import LogoutButton from "@/components/buttons/LogoutButton";

type NavLink = {
    name: string;
    path: string;
    onClick: () => void;
};

export default function HeaderRBD() {
    const router = useRouter();
    const pathname = usePathname();

    const goAnalyticsHome = () => {
        router.push("/rbd/analytics");
    };

    const goMyProfile = () => {
        router.push("/rbd/profile");
    };

    const goEventAnalytics = () => {
        location.href = `/rbd/analytics/events/`;
    };

    const goDonorAnalytics = () => {
        router.push("/rbd/analytics/donors");
    };

    const goOverallAnalytics = () => {
        router.push("/rbd/analytics/overall");
    };

    const goLogout = () => {
        router.push("/landing");
    };

    const navLinks: NavLink[] = [
        {
            name: "Home",
            path: "/rbd/analytics",
            onClick: goAnalyticsHome,
        },
        {
            name: "Profile",
            path: "/rbd/profile",
            onClick: goMyProfile,
        },
        {
            name: "Event Analytics",
            path: "/rbd/analytics/events",
            onClick: goEventAnalytics,
        },
        {
            name: "Donor Analytics",
            path: "/rbd/analytics/donors",
            onClick: goDonorAnalytics,
        },
        {
            name: "Overall Analytics",
            path: "/rbd/analytics/overall",
            onClick: goOverallAnalytics,
        },
    ];

    const isActiveLink = (path: string) => {
        if (path === "/rbd/analytics") {
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
                        onClick={goAnalyticsHome}
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

                <LogoutButton/>
            </div>
        </div>
    );
}