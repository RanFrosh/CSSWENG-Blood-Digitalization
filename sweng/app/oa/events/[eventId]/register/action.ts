"use server";

import { redirect } from "next/navigation";
import { eq, or } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { profiles } from "@/db/schemas/profiles";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { adminSupa } from "@/db/supaadmin";
import { executeLogEvent } from "@/actions/event_action";

type RegisterState = { error?: string } | null;

export async function registerDonorAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  
  const eventId = formData.get("eventId") as string;
  const firstName = formData.get("firstName") as string;
  const middleName = formData.get("middleName") as string | null;
  const lastName = formData.get("lastName") as string;
  const age = formData.get("age") as string;
  const sex = formData.get("sex") as string;
  const bloodType = formData.get("bloodType") as string;
  const email = formData.get("email") as string;
  const mobileNumber = formData.get("mobileNumber") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  
  const existingDonor = await orm
    .select({ email: donor.email, mobile_no: donor.mobile_no })
    .from(donor)
    .where(or(eq(donor.email, email), eq(donor.mobile_no, mobileNumber)))
    .limit(1);

  if (existingDonor.length > 0) return { error: "Email or Mobile is already registered." };

  try {
    let newDonorId: bigint | null = null;
    let authUserId: string;

   
    const { data: authData, error: authError } = await adminSupa.auth.admin.createUser({
        email: email,
        password: Math.random().toString(36).slice(-10) + "A1!",
        email_confirm: true,
    });

    if (authError || !authData.user) {
        return { error: `Auth failed: ${authError?.message}` };
    }
    
    authUserId = authData.user.id;
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;

    await orm.transaction(async (tx) => {
      
      await tx.insert(profiles).values({
          id: authUserId,
          name: fullName,
          email: email,
          role: "donor",
          active: true,
          profile_image_url: "placeholder.jpg"
      });

      const [newDonor] = await tx
        .insert(donor)
        .values({
          profile_id: authUserId,
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
          email: email,
          mobile_no: mobileNumber,
          age: Number(age),
          zip_code: zipCode,
          sex: sex as any,
          blood: bloodType as any,
          city_id: BigInt(city)
        })
        .returning({ 
          id: donor.id,
          qr_token: donor.qr_token 
        });

      newDonorId = newDonor.id;

        await tx.insert(donor_to_event).values({
        donor_id: newDonorId,
        event_id: BigInt(eventId),
        is_success: false, 
      });
      
    });

    if (newDonorId) {
        await executeLogEvent({
            event_log_id: BigInt(eventId),
            donor_id: newDonorId,
            action: "register",
            time: new Date().toTimeString().slice(0, 8)
        });
    }

  } catch (error: any) {
    console.error("DONOR INSERT ERROR:", error);
    return { error: "Failed to create donor account and register." };
  }

  // 6. Redirect to Scanner
  redirect(`/oa/events/${eventId}/scanner`);
}