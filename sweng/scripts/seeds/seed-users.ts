import { createClient } from "@supabase/supabase-js";
import { orm } from "@/db/drizzle";
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

type AccessLevel = "donor" | "onsite_admin" | "med_prof" | "director" | "super_admin" | "recov_staff" | "lab_staff";

interface SeedUser {
    // For the Supabase Auth
    email: string;
    password: string;
    
    // For the Drizzle Profiles
    name: string;
    role: AccessLevel;
    profile_image_url?: string | null; // Optional, defaults to null
    active?: boolean; // Optional, defaults to true
}

const users: SeedUser[] = [
    // =========================
    // Onsite Admins
    // =========================
    {
        name: "Maria Santos",
        email: "oa1@redbank.com",
        password: "Onsite123!",
        role: "onsite_admin",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Joshua Reyes",
        email: "oa2@redbank.com",
        password: "Onsite123!",
        role: "onsite_admin",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Christine Navarro",
        email: "oa3@redbank.com",
        password: "Onsite123!",
        role: "onsite_admin",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Lab Staff
    // =========================
    {
        name: "Patricia Cruz",
        email: "ls1@redbank.com",
        password: "LabStaff123!",
        role: "lab_staff",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Daniel Garcia",
        email: "ls2@redbank.com",
        password: "LabStaff123!",
        role: "lab_staff",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Rochelle Mendoza",
        email: "ls3@redbank.com",
        password: "LabStaff123!",
        role: "lab_staff",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Super Admins
    // =========================
    {
        name: "Angela Mendoza",
        email: "sa1@redbank.com",
        password: "SuperAdmin123!",
        role: "super_admin",
        profile_image_url:
            "https://i.pinimg.com/564x/3a/3d/4b/3a3d4b04d70cc293fadf195b4e1a7bcb.jpg",
        active: true,
    },
    {
        name: "Rafael Torres",
        email: "sa2@redbank.com",
        password: "SuperAdmin123!",
        role: "super_admin",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Gabriel Flores",
        email: "sa3@redbank.com",
        password: "SuperAdmin123!",
        role: "super_admin",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Redbank Directors
    // =========================
    {
        name: "Elena Villanueva",
        email: "rbd1@redbank.com",
        password: "Director123!",
        role: "director",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Antonio Navarro",
        email: "rbd2@redbank.com",
        password: "Director123!",
        role: "director",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Teresa Bautista",
        email: "rbd3@redbank.com",
        password: "Director123!",
        role: "director",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Recovery Staff
    // =========================
    {
        name: "Camille Bautista",
        email: "rs1@redbank.com",
        password: "RecovStaff123!",
        role: "recov_staff",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Miguel Aquino",
        email: "rs2@redbank.com",
        password: "RecovStaff123!",
        role: "recov_staff",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Janine Castillo",
        email: "rs3@redbank.com",
        password: "RecovStaff123!",
        role: "recov_staff",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Medical Professionals
    // =========================
    {
        name: "Dr. Andrea Flores",
        email: "mp1@redbank.com",
        password: "MedProf123!",
        role: "med_prof",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Dr. Carlo Ramirez",
        email: "mp2@redbank.com",
        password: "MedProf123!",
        role: "med_prof",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Dr. Nicole Santiago",
        email: "mp3@redbank.com",
        password: "MedProf123!",
        role: "med_prof",
        profile_image_url: null,
        active: true,
    },

    // =========================
    // Donors
    // =========================
    {
        name: "Mark Anthony Dela Cruz",
        email: "mark.delacruz@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url:
            "https://pet-health-content-media.chewy.com/wp-content/uploads/2025/06/04200354/Shiba-Inu.jpg",
        active: true,
    },
    {
        name: "Beatrice Lim",
        email: "beatrice.lim@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
    },
    {
        name: "John Carlo Reyes",
        email: "john.reyes@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Sofia Mae Garcia",
        email: "sofia.garcia@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
    },
    {
        name: "Christian Villanueva",
        email: "christian.villanueva@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
    },
];

async function masterSeed() {
    console.log("Seeding Accounts and Profiles\n");

    for (const user of users) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
        });

        if (authError) {
            console.error(`Failed Auth: ${user.email} ->`, authError.message);
            continue;
        }

        const newUserId = authData.user.id;

        try {
            await orm.insert(profiles).values({
                id: newUserId,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image_url: user.profile_image_url || null,
                active: user.active !== false,
            });
            console.log(`Fully Seeded: ${user.name} (${user.role})`);
        } catch (dbError: any) {
            console.error(`Failed Profile: ${user.email} ->`, dbError.message);
        }
    }

    console.log("\nAccounts and Profiles seeded");
    process.exit(0);
}

masterSeed();