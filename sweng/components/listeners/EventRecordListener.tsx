"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function EventRecordListener({ eventId }: { eventId: string }) {
    const router = useRouter();

    useEffect(() => {

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        );

        const channel = supabase
            .channel('event_record-updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'event_record',
                    filter: `event_log_id=eq.${eventId}`
                },
                (payload) => {
                    console.log("Event records updated", payload);
                    router.refresh(); 
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId, router]);

    return null;
}