import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

type AccessLevel =
  | "onsite_admin"
  | "med_prof"
  | "director"
  | "super_admin"
  | "staff_admin"
  | "recov_staff"
  | "lab_staff";

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: AccessLevel;
}

const users: SeedUser[] = [
  {
    email: "onsite.admin@redbank.com",
    password: "Onsite123!",
    name: "Anne Samonte",
    role: "onsite_admin",
  },
  {
    email: "med.prof@redbank.com",
    password: "MedProf123!",
    name: "Avram Tiu",
    role: "med_prof",
  },
  {
    email: "director@redbank.com",
    password: "Director123!",
    name: "Maxine Varela",
    role: "director",
  },
  {
    email: "super.admin@redbank.com",
    password: "SuperAdmin123!",
    name: "Paul Tan",
    role: "super_admin",
  },
  {
    email: "staff.admin@redbank.com",
    password: "StaffAdmin123!",
    name: "Sophia Sena",
    role: "staff_admin",
  },
  {
    email: "recov.staff@redbank.com",
    password: "RecovStaff123!",
    name: "Adrian Dee",
    role: "recov_staff",
  },
  {
    email: "lab.staff@redbank.com",
    password: "LabStaff123!",
    name: "Kylie Mariazeta",
    role: "lab_staff",
  },
];

async function seedAccounts() {
  console.log("Seeding mock accounts...\n");

  for (const user of users) {
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        console.log(`Skipped (already exists): ${user.email}`);
        continue;
      }
      console.error(`Failed to create auth user: ${user.email}`, authError.message);
      continue;
    }

    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, name: user.name, role: user.role, email: user.email });

    if (profileError) {
      console.error(`Failed to upsert profile: ${user.email}`, profileError.message);
      continue;
    }

    console.log(`Created: ${user.email} (${user.role})`);
  }

  console.log("\nSeeding complete.");
}

seedAccounts();