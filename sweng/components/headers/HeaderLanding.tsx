"use client"
import { useRouter, usePathname } from 'next/navigation';

export default function HeaderLanding() {

    const router = useRouter();
    const pathname = usePathname();

    const goHome = () => {
        router.push('/landing'); 
    };

    const navLinks = [
        { name: 'Sign In', path: '/landing' },
    ];

    const isActiveLink = (path: string) => {
        return pathname === path;
    };

    return (

        <div className = "h-[0.75in] border-b-[5px] bg-[#fd5448] border-[#fd5448]">

            <div className = "p-[0.125in] gap-[0.5in] flex flex-row items-center">

                <img 
                    className = "h-[0.5in] w-auto cursor-pointer pl-[0.25in]" 
                    src = "/images/redbank_onred.png"
                    onClick = {goHome}
                />

                <div className = "text-[18px] text-white flex flex-row items-center gap-[0.25in] font-[Montserrat]">
                    {navLinks.map((link) => (
                        <p
                            key={link.path}
                            className={`cursor-pointer hover:text-[#1b4054] ${
                                isActiveLink(link.path) ? "font-bold" : "font-normal"
                            }`}
                            onClick={() => {
                                if (link.path === '/') {
                                    goHome();
                                }
                            }}
                        >
                            {link.name}
                        </p>
                    ))}
                </div>

            </div>

        </div>
    );
}