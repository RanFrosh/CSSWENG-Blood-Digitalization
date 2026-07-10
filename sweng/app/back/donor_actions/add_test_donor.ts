"use server";

import { serverSupa } from "@/db/supaserver";

export async function addTestDonor() {

  const supabase = await serverSupa();

  // Hardcoded payload matching your exact Drizzle schema
  const testDonor = {
    first_name: "Diogo",
    last_name: "Jota",
    middle_name: "Silva",
    email: "jota@fcbayern.com",
    mobile_no: "09772632330",
    street: "123 Taft Ave",
    zip_code: "1004",
    sex: "Male",
    blood: "O+",
    city_id: 1, // *CRITICAL: Ensure City ID 1 exists in your DB!
    photo_path: "/uploads/jota.png",
    height: 178.5,
    weight: 73.0,
    active: true
  };

  console.log("🚀 Firing payload to Supabase...");

  const { data, error } = await supabase
    .from("donor") // Ensure this matches your exact table name in Supabase
    .insert([testDonor])
    .select();

  if (error) {
    console.error("❌ Backend Engine Error:", error.message);
    return { success: false, error: error.message };
  }

  console.log("✅ Success! Donor injected:", data);
  return { success: true, data };
}