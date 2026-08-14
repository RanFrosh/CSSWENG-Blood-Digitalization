"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function QueueListener({ eventId }: { eventId: string }) {
    const router = useRouter();

    useEffect(() => {

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const channel = supabase
            .channel('queue-updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'event_queue',
                    filter: `event_log_id=eq.${eventId}`
                },
                (payload) => {
                    console.log("New donor entered the queue!", payload);
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