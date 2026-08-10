import { createClient } from "@supabase/supabase-js";
import { orm } from "@/db/drizzle";
import { profiles } from "@/db/schemas/profiles";
import { donor } from "@/db/schemas/donor";
import { city } from "@/db/schemas/city";

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

    mobile_no?: string;
    sex?: "Male" | "Female";
    verifiedBlood?: boolean,
    blood?: string;
    birthdate?: string;
    age?: number;
    zip_code?: string;
    height?: number;
    weight?: number;
    next_eligibility?: string | null;
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
        name: "Mark Dela Cruz",
        email: "mark.delacruz@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url:
            "https://pet-health-content-media.chewy.com/wp-content/uploads/2025/06/04200354/Shiba-Inu.jpg",
        active: true,
        mobile_no: "09171234567", sex: "Male" as any, blood: "O+" as any, birthdate: "1995-05-15", age: 31,
        zip_code: "1000", height: 170.5, weight: 75.0, verifiedBlood: true, next_eligibility: "2025-01-01",
    },
    {
        name: "Beatrice Lim",
        email: "beatrice.lim@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
        mobile_no: "09189876543", sex: "Female" as any, blood: "A+" as any, birthdate: "1998-08-22", age: 28,
        zip_code: "1226", height: 158.0, weight: 55.5, verifiedBlood: true, next_eligibility: "2026-05-10", 
    },
    {
        name: "John Reyes",
        email: "john.reyes@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
        mobile_no: "09191122334", sex: "Male" as any, blood: "B-" as any, birthdate: "2001-11-30", age: 24,
        zip_code: "1100", height: 165.0, weight: 62.3, verifiedBlood: false, next_eligibility: null,
    },
    {
        name: "Sofia Garcia",
        email: "sofia.garcia@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
        mobile_no: "09204455667",sex: "Female" as any, blood: "AB+" as any, birthdate: "1992-02-14", age: 34,
        zip_code: "1630", height: 160.2, weight: 58.1, verifiedBlood: true, next_eligibility: "2026-09-15",
    },
    {
        name: "Christian Villanueva",
        email: "christian.villanueva@gmail.com",
        password: "Donor123!",
        role: "donor",
        profile_image_url: null,
        active: true,
        mobile_no: "09227788990", sex: "Male" as any, blood: "O-" as any, birthdate: "1988-07-07", age: 38,
        zip_code: "1015", height: 175.0, weight: 82.5, verifiedBlood: true, next_eligibility: "2024-12-25", 
    },
    {
    name: "Ana Villanueva",
    email: "ana.villanueva@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09173344556",
    sex: "Female",
    blood: "A-",
    birthdate: "1994-03-12",
    age: 32,
    zip_code: "1105",
    height: 155.0,
    weight: 52.0,
    next_eligibility: "2026-02-14",
},
{
    name: "Mark Bautista",
    email: "mark.bautista@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09184455667",
    sex: "Male",
    blood: "B+",
    birthdate: "1990-09-05",
    age: 36,
    zip_code: "1550",
    height: 178.5,
    weight: 85.0,
    next_eligibility: "2025-11-20",
},
{
    name: "Patricia Gonzales",
    email: "patricia.gonzales@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09195566778",
    sex: "Female",
    blood: "O+",
    birthdate: "2000-01-20",
    age: 26,
    zip_code: "1600",
    height: 162.0,
    weight: 60.0,
    next_eligibility: "2026-10-01", 
  },
  {
    name: "Jose Aquino",
    email: "jose.aquino@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09206677889",
    sex: "Male",
    blood: "AB-",
    birthdate: "1985-11-11",
    age: 41,
    zip_code: "1700",
    height: 168.0,
    weight: 78.5,
  },
  {
    name: "Christine Ramos",
    email: "christine.ramos@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09217788990",
    sex: "Female",
    blood: "O-",
    birthdate: "1997-07-30",
    age: 29,
    zip_code: "1410",
    height: 159.5,
    weight: 54.2,
    next_eligibility: "2026-07-01", 
  },
  {
    name: "Kevin Cruz",
    email: "kevin.cruz@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09228899001",
    sex: "Male",
    blood: "A+",
    birthdate: "1993-04-18",
    age: 33,
    zip_code: "1008",
    height: 172.0,
    weight: 70.0,
    next_eligibility: "2025-06-15",
  },
  {
    name: "Bea Torres",
    email: "bea.torres@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09179900112",
    sex: "Female",
    blood: "B-",
    birthdate: "1999-12-05",
    age: 26,
    zip_code: "1109",
    height: 163.0,
    weight: 59.0,
  },
  {
    name: "Rafael Ocampo",
    email: "rafael.ocampo@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09181011223",
    sex: "Male",
    blood: "O+",
    birthdate: "1982-08-22",
    age: 44,
    zip_code: "1229",
    height: 171.0,
    weight: 80.2,
    next_eligibility: "2026-01-10",
  },
  {
    name: "Diana Castro",
    email: "diana.castro@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09192122334",
    sex: "Female",
    blood: "AB+",
    birthdate: "1991-06-14",
    age: 35,
    zip_code: "1740",
    height: 157.0,
    weight: 53.5,
    next_eligibility: "2026-08-25", 
  },
  {
    name: "Paolo Navarro",
    email: "paolo.navarro@example.com",
    password: "password123",
    role: "donor",
    mobile_no: "09203233445",
    sex: "Male",
    blood: "A+",
    birthdate: "2004-02-10",
    age: 22,
    zip_code: "1632",
    height: 169.5,
    weight: 65.0,
    next_eligibility: "2025-09-09",
  }
];

async function masterSeed() {

    console.log("Seeding Accounts and Profiles\n");

    const cityResult = await orm.select({ id: city.id }).from(city).limit(1);
        
    if (cityResult.length === 0) {
        throw new Error("No cities found! Please insert at least one city first.");
    }
    
    const defaultCityId = cityResult[0].id;

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

            if (user.role === "donor") {
                const nameParts = user.name.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ") || "Doe";

                await orm.insert(donor).values({

                    profile_id: newUserId,
                    first_name: firstName,
                    last_name: lastName,
                    email: user.email,
                    
                    mobile_no: user.mobile_no || "09170000000",
                    sex: (user.sex || "Male") as any, 
                    blood: (user.blood || "O+") as any,
                    birthdate: user.birthdate || "1995-01-01",
                    age: user.age || 31,
                    city_id: defaultCityId,
                    zip_code: user.zip_code || "1000",
                    height: user.height || 170.0,
                    weight: user.weight || 70.0,
                    verifiedBlood: true,
                    active: true,
                    next_eligibility: user.next_eligibility || "2026-10-01", 
                });
                console.log(`Fully Seeded (With Donor Record): ${user.name}`);
            } 
            
            else {
                console.log(`Fully Seeded (Staff Record): ${user.name} (${user.role})`);
            }

        } catch (dbError: any) {
            console.error(`Failed Profile: ${user.email} ->`, dbError.message);
        }
    }

    console.log("\nAccounts and Profiles seeded");
    process.exit(0);
}

masterSeed();