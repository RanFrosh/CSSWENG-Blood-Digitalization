import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";
import { profiles } from "@/db/schemas/profiles";
import AccessDenied from "@/components/AccessDenied";

export default async function DirectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await serverSupa();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/landing");
    }

    const staffProfiles = await orm
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1);

    const staff = staffProfiles[0];

    if (!staff || staff.role !== "director") {
        return <AccessDenied requiredRole="Directors" currentRole={staff?.role} />
    }

    return <>{children}</>;
}