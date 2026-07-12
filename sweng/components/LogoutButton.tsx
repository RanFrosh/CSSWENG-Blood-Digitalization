"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { executeLogout } from "@/app/logout/logout_action";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        const result = await executeLogout();
        
        if (result.success) {
            router.push("/landing");

            router.refresh(); 
        } else {
            console.error(result.message);
            alert("Failed to log out safely.");
            setIsLoggingOut(false);
        }
    };

    return (
        <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mr-[0.25in] text-[18px] text-white font-[Montserrat] cursor-pointer hover:text-[#1b4054]"
        >
            {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
    );
}