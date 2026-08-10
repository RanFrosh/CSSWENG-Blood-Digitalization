import { createClient } from "@supabase/supabase-js";
import { orm } from "@/db/drizzle";
import { sql } from "drizzle-orm"; 
import { profiles } from "@/db/schemas/profiles";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

async function clearUsers() {
    console.log("Clearing Users and Donors\n");

    try {
        console.log("Clearing Drizzle Profiles and Donors...");
        
        await orm.execute(sql`TRUNCATE TABLE donor, profiles CASCADE;`);
        
        console.log("Drizzle Profiles and Donors wiped clean.");
    } catch (error: any) {
        console.error("Failed to clear database tables:", error.message);
        process.exit(1);
    }

    try {
        console.log("Fetching all Supabase Auth users...");
        
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
            perPage: 1000
        });

        if (listError) throw listError;

        if (users.length === 0) {
            console.log("No Supabase Auth users to delete.");
        } else {
            console.log(`⏳ Deleting ${users.length} Supabase Auth users...`);
            let deletedCount = 0;

            for (const user of users) {
                const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
                if (deleteError) {
                    console.error(`   └─ Failed to delete ${user.email}:`, deleteError.message);
                } else {
                    deletedCount++;
                }
            }
            console.log(`Deleted ${deletedCount} Supabase Auth users.`);
        }

    } catch (error: any) {
        console.error("Failed to clear Supabase Auth:", error.message);
        process.exit(1);
    }

    console.log("\nUsers and Donors Cleared");
    process.exit(0);
}

clearUsers();