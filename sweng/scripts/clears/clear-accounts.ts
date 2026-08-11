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

const emails = [
  "onsite.admin@redbank.com",
  "med.prof@redbank.com",
  "director@redbank.com",
  "super.admin@redbank.com",
  "staff.admin@redbank.com",
  "recov.staff@redbank.com",
  "lab.staff@redbank.com",
];

async function clearAccounts() {
  console.log("Clearing mock accounts...\n");

  const { data, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Failed to list users", listError.message);
    return;
  }

  for (const email of emails) {
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      console.log(`Not found, skipping: ${email}`);
      continue;
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(`Failed to delete: ${email}`, deleteError.message);
      continue;
    }

    console.log(`Deleted: ${email}`);
  }

  console.log("\nClear complete.");
}

clearAccounts();