import { orm } from "@/db/drizzle";
import { profiles } from "@/db/schemas/profiles";

async function main() {
    console.log("🌱 Blowing the whistle... Starting database seed!");

    try {
        // IMPORTANT: Replace these UUIDs with the actual UUIDs of the test users 
        // you created in your Supabase Authentication dashboard.
        const seedProfiles = [
            {
                id: "11111111-1111-1111-1111-111111111111",
                name: "Steph Curry",
                email: "steph.lab@redbank.com",
                role: "lab_staff",
                profile_image_url: "/images/steph.png",
                active: true,
            },
            {
                id: "22222222-2222-2222-2222-222222222222", 
                name: "Steve Kerr",
                email: "coach.kerr@redbank.com",
                role: "super_admin",
                profile_image_url: "/images/kerr.png",
                active: true,
            },
            {
                id: "33333333-3333-3333-3333-333333333333", 
                name: "Klay Thompson",
                email: "klay.onsite@redbank.com",
                role: "onsite_admin",
                profile_image_url: null, // Testing the nullable field!
                active: true,
            }
        ];

        // Execute the play
        await orm.insert(profiles).values(seedProfiles).onConflictDoNothing();

        console.log("✅ Roster successfully loaded. Database seeded!");
    } catch (error) {
        console.error("❌ Turnover on the play. Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

main();