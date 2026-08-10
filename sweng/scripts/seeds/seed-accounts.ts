import { createClient } from "@supabase/supabase-js";

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

type AccessLevel =
    | "donor"
    | "onsite_admin"
    | "med_prof"
    | "director"
    | "super_admin"
    | "recov_staff"
    | "lab_staff";

interface SeedUser {
    email: string;
    password: string;
    name: string;
    role: AccessLevel;
}

const users: SeedUser[] = [
    // =========================
    // Onsite Admins
    // =========================
    {
        email: "oa1@redbank.com",
        password: "Onsite123!",
        name: "Maria Santos",
        role: "onsite_admin",
    },
    {
        email: "oa2@redbank.com",
        password: "Onsite123!",
        name: "Joshua Reyes",
        role: "onsite_admin",
    },
    {
        email: "oa3@redbank.com",
        password: "Onsite123!",
        name: "Christine Navarro",
        role: "onsite_admin",
    },

    // =========================
    // Lab Staff
    // =========================
    {
        email: "ls1@redbank.com",
        password: "LabStaff123!",
        name: "Patricia Cruz",
        role: "lab_staff",
    },
    {
        email: "ls2@redbank.com",
        password: "LabStaff123!",
        name: "Daniel Garcia",
        role: "lab_staff",
    },
    {
        email: "ls3@redbank.com",
        password: "LabStaff123!",
        name: "Rochelle Mendoza",
        role: "lab_staff",
    },

    // =========================
    // Super Admins
    // =========================
    {
        email: "sa1@redbank.com",
        password: "SuperAdmin123!",
        name: "Angela Mendoza",
        role: "super_admin",
    },
    {
        email: "sa2@redbank.com",
        password: "SuperAdmin123!",
        name: "Rafael Torres",
        role: "super_admin",
    },
    {
        email: "sa3@redbank.com",
        password: "SuperAdmin123!",
        name: "Gabriel Flores",
        role: "super_admin",
    },

    // =========================
    // Redbank Directors
    // =========================
    {
        email: "rbd1@redbank.com",
        password: "Director123!",
        name: "Elena Villanueva",
        role: "director",
    },
    {
        email: "rbd2@redbank.com",
        password: "Director123!",
        name: "Antonio Navarro",
        role: "director",
    },
    {
        email: "rbd3@redbank.com",
        password: "Director123!",
        name: "Teresa Bautista",
        role: "director",
    },

    // =========================
    // Recovery Staff
    // =========================
    {
        email: "rs1@redbank.com",
        password: "RecovStaff123!",
        name: "Camille Bautista",
        role: "recov_staff",
    },
    {
        email: "rs2@redbank.com",
        password: "RecovStaff123!",
        name: "Miguel Aquino",
        role: "recov_staff",
    },
    {
        email: "rs3@redbank.com",
        password: "RecovStaff123!",
        name: "Janine Castillo",
        role: "recov_staff",
    },

    // =========================
    // Medical Professionals
    // =========================
    {
        email: "mp1@redbank.com",
        password: "MedProf123!",
        name: "Dr. Andrea Flores",
        role: "med_prof",
    },
    {
        email: "mp2@redbank.com",
        password: "MedProf123!",
        name: "Dr. Carlo Ramirez",
        role: "med_prof",
    },
    {
        email: "mp3@redbank.com",
        password: "MedProf123!",
        name: "Dr. Nicole Santiago",
        role: "med_prof",
    },

    // =========================
    // Donors
    // =========================
    {
        email: "mark.delacruz@gmail.com",
        password: "Donor123!",
        name: "Mark Anthony Dela Cruz",
        role: "donor",
    },
    {
        email: "beatrice.lim@gmail.com",
        password: "Donor123!",
        name: "Beatrice Lim",
        role: "donor",
    },
    {
        email: "john.reyes@gmail.com",
        password: "Donor123!",
        name: "John Carlo Reyes",
        role: "donor",
    },
    {
        email: "sofia.garcia@gmail.com",
        password: "Donor123!",
        name: "Sofia Mae Garcia",
        role: "donor",
    },
    {
        email: "christian.villanueva@gmail.com",
        password: "Donor123!",
        name: "Christian Villanueva",
        role: "donor",
    },
];

async function seedAccounts() {
    console.log("🌱 Seeding mock accounts...\n");

    for (const user of users) {
        const { data, error: authError } =
            await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
            });

        if (authError) {
            if (authError.message.includes("already been registered")) {
                console.log(`⏭️  Skipped (already exists): ${user.email}`);
                continue;
            }

            console.error(
                `❌ Failed to create: ${user.email}`,
                authError.message
            );
            continue;
        }

        console.log(
            `✅ Created: ${user.email} | ${user.role} | UUID: ${data.user.id}`
        );
    }

    console.log("\n✅ Account seeding complete.");
}

seedAccounts();