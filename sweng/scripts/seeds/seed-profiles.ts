import { orm } from "@/db/drizzle";
import { profiles } from "@/db/schemas/profiles";
import { InferInsertModel } from "drizzle-orm";

async function main() {
    console.log("🌱 Blowing the whistle... Starting database seed!");

    try {
        const seedProfiles: InferInsertModel<typeof profiles>[] = [
            // =========================
            // Onsite Admins
            // =========================
            {
                id: "0d169db2-8d21-483a-b48b-b5b6510e5352",
                name: "Maria Santos",
                email: "oa1@redbank.com",
                role: "onsite_admin",
                profile_image_url: null,
                active: true,
            },
            {
                id: "2b6e1357-bd4c-4b45-8ca5-6e297e51fd86",
                name: "Joshua Reyes",
                email: "oa2@redbank.com",
                role: "onsite_admin",
                profile_image_url: null,
                active: true,
            },
            {
                id: "9b90bd9f-7d2b-49aa-a49e-af5cea5294af",
                name: "Christine Navarro",
                email: "oa3@redbank.com",
                role: "onsite_admin",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Lab Staff
            // =========================
            {
                id: "0e9af998-95e7-4e9b-a1cb-9676192ff41e",
                name: "Patricia Cruz",
                email: "ls1@redbank.com",
                role: "lab_staff",
                profile_image_url: null,
                active: true,
            },
            {
                id: "fd3a2292-6062-4c4f-861d-15f6dd448eee",
                name: "Daniel Garcia",
                email: "ls2@redbank.com",
                role: "lab_staff",
                profile_image_url: null,
                active: true,
            },
            {
                id: "ca86a3ee-5be9-40ba-883e-abc94804bdcc",
                name: "Rochelle Mendoza",
                email: "ls3@redbank.com",
                role: "lab_staff",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Super Admins
            // =========================
            {
                id: "84120a82-f0b3-42e8-818d-97ca9136bb3f",
                name: "Angela Mendoza",
                email: "sa1@redbank.com",
                role: "super_admin",
                profile_image_url:
                    "https://i.pinimg.com/564x/3a/3d/4b/3a3d4b04d70cc293fadf195b4e1a7bcb.jpg",
                active: true,
            },
            {
                id: "3a6117ed-9b13-4768-b220-c7d6bd96e667",
                name: "Rafael Torres",
                email: "sa2@redbank.com",
                role: "super_admin",
                profile_image_url: null,
                active: true,
            },
            {
                id: "49d370e0-f35e-45c4-8d49-52ca206ecbd8",
                name: "Gabriel Flores",
                email: "sa3@redbank.com",
                role: "super_admin",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Redbank Directors
            // =========================
            {
                id: "cdf93754-f40e-4576-8321-5ce226472812",
                name: "Elena Villanueva",
                email: "rbd1@redbank.com",
                role: "director",
                profile_image_url: null,
                active: true,
            },
            {
                id: "38053c59-c1a5-49f6-9f86-0066f449c6db",
                name: "Antonio Navarro",
                email: "rbd2@redbank.com",
                role: "director",
                profile_image_url: null,
                active: true,
            },
            {
                id: "4a024c49-73e7-4661-bf3b-bb1a21663925",
                name: "Teresa Bautista",
                email: "rbd3@redbank.com",
                role: "director",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Recovery Staff
            // =========================
            {
                id: "39493834-e6eb-4c1d-8e4e-9cfed4e433bc",
                name: "Camille Bautista",
                email: "rs1@redbank.com",
                role: "recov_staff",
                profile_image_url: null,
                active: true,
            },
            {
                id: "7144eaf7-9724-4eca-9f4c-c8794aeda864",
                name: "Miguel Aquino",
                email: "rs2@redbank.com",
                role: "recov_staff",
                profile_image_url: null,
                active: true,
            },
            {
                id: "20ce7fa5-5c36-4a86-aaab-3974ad2a4cdf",
                name: "Janine Castillo",
                email: "rs3@redbank.com",
                role: "recov_staff",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Medical Professionals
            // =========================
            {
                id: "37028df1-4ea3-47ef-af32-22715086c474",
                name: "Dr. Andrea Flores",
                email: "mp1@redbank.com",
                role: "med_prof",
                profile_image_url: null,
                active: true,
            },
            {
                id: "f9a77d12-9582-45a1-ba58-450598ff24ef",
                name: "Dr. Carlo Ramirez",
                email: "mp2@redbank.com",
                role: "med_prof",
                profile_image_url: null,
                active: true,
            },
            {
                id: "2414d5be-d4be-4d56-adde-631117ca89bf",
                name: "Dr. Nicole Santiago",
                email: "mp3@redbank.com",
                role: "med_prof",
                profile_image_url: null,
                active: true,
            },

            // =========================
            // Donors
            // =========================
            {
                id: "fd877f46-d877-48df-9ca1-5f49d56ff7ec",
                name: "Mark Anthony Dela Cruz",
                email: "mark.delacruz@gmail.com",
                role: "donor",
                profile_image_url:
                    "https://pet-health-content-media.chewy.com/wp-content/uploads/2025/06/04200354/Shiba-Inu.jpg",
                active: true,
            },
            {
                id: "1ca13b0c-c107-452d-9d58-b84bbac1c8d5",
                name: "Beatrice Lim",
                email: "beatrice.lim@gmail.com",
                role: "donor",
                profile_image_url: null,
                active: true,
            },
            {
                id: "4683fe89-a9e0-42ff-ae50-ae29dac788e6",
                name: "John Carlo Reyes",
                email: "john.reyes@gmail.com",
                role: "donor",
                profile_image_url: null,
                active: true,
            },
            {
                id: "cfc99777-2f97-41a1-80d5-483d0fd1d2f6",
                name: "Sofia Mae Garcia",
                email: "sofia.garcia@gmail.com",
                role: "donor",
                profile_image_url: null,
                active: true,
            },
            {
                id: "a9bf0810-d746-4544-a351-4fec6bc8d23e",
                name: "Christian Villanueva",
                email: "christian.villanueva@gmail.com",
                role: "donor",
                profile_image_url: null,
                active: true,
            },
        ];

        await orm
            .insert(profiles)
            .values(seedProfiles)
            .onConflictDoNothing({ target: profiles.id });

        console.log("✅ Roster successfully loaded. Database seeded!");
    } catch (error) {
        console.error("❌ Turnover on the play. Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

main();