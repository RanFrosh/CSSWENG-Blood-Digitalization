"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinEventAction } from "@/actions/ls_action";

interface JoinEventButtonProps {
    eventId: string;
    onSuccess?: () => void;
}

export default function JoinEventButton({ eventId, onSuccess }: JoinEventButtonProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccessStatus, setIsSuccessStatus] = useState<boolean | null>(null);
    const router = useRouter();
    

    const handleJoin = async () => {
        if (!eventId.trim()) {
            setMessage("Please enter an event ID.");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setIsSuccessStatus(null);

        const response = await joinEventAction(eventId);

        if (response.success) {
            setIsSuccessStatus(true);
            setMessage("Joined successfully!");
            router.refresh();
            
            if (onSuccess) {
                setTimeout(onSuccess, 1000);
            }
        } else {
            setIsSuccessStatus(false);
            setMessage(response.message);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <button 
                type="button"
                onClick={handleJoin}
                disabled={isLoading}
                className="w-full px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all"
            >
                {isLoading ? "Joining..." : "Join Event"}
            </button>
            
            {message && (
                <span className={`text-sm font-semibold text-center ${isSuccessStatus ? 'text-green-600' : 'text-red-500'}`}>
                    {message}
                </span>
            )}
        </div>
    );
}