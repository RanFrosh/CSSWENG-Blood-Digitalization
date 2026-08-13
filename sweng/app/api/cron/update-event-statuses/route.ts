import { NextResponse } from "next/server";
import { executeUpdateEventStatuses } from "@/app/event_records/event_action";

export async function GET(request: Request) {
    if (
        request.headers.get("authorization") !==
        `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await executeUpdateEventStatuses();

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
