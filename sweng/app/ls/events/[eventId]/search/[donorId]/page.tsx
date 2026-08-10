"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderLS";

// Sample donor info structure
type DonorInfo = {
    id: string;
    name: string;
    bday: string;
    sex: string;
    bloodType: string;
    bloodBagId: string;
    volumeCollected: string;
    completionTime: string;
    donationOutcome: string;
    observations: string;
};

// Sample donor info
const donorInfo: DonorInfo = {
    id: "D-005",
    name: "June Doe",
    bday: "XX/XX/XXXX",
    sex: "Female",
    bloodType: "O+",
    bloodBagId: "BAG-005",
    volumeCollected: "450 mL",
    completionTime: "14:30",
    donationOutcome: "Successful",
    observations: "Donation completed successfully. No complications were observed during collection.",
};

export default function EditPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const recordDonor = () => {
        const donor = donorInfo;

        const isConfirmed = confirm(
            `Donor ID: ${donor.id}\nName: ${donor.name}\n\nBlood Bag ID: ${donor.bloodBagId}\n\nSubmit edit request?`
        );

        if (isConfirmed) {
            alert("Edit request successfully sent for review!");
            router.push(`/ls/events/${eventId}`);
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Lab Staff
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Blood Donation Record
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Basic Donor Information
                        </h2>

                        <div>
                            <span className="bg-[#002940] text-white border-2 border-[#002940] px-5 py-3 rounded-full text-[18px] font-semibold">
                                Donor ID: {donorInfo.id}
                            </span>
                        </div>
                    </div>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Name
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.name}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Birth Date
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.bday}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Sex
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.sex}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Type
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.bloodType}
                            </p>
                        </div>
                    </div>
                </section>

                <form className="mt-[0.35in] flex flex-col gap-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donation Details
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-1 xl:grid-cols-4 gap-[0.25in]">
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Blood Bag ID
                                </label>

                                <input
                                    type="text"
                                    defaultValue={donorInfo.bloodBagId}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Volume Collected
                                </label>

                                <input
                                    type="text"
                                    defaultValue={donorInfo.volumeCollected}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Completion Time
                                </label>

                                <input
                                    type="time"
                                    defaultValue={donorInfo.completionTime}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Blood Type
                                </label>

                                <input
                                    type="text"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Collection Outcome
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Donation Outcome
                                </p>

                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label>
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            defaultChecked
                                            className="mr-2"
                                        />
                                        Successful
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            className="mr-2"
                                        />
                                        Incomplete
                                    </label>
                                </div>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Blood Quality
                                </p>

                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label>
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            className="mr-2"
                                        />
                                        Pass
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            className="mr-2"
                                        />
                                        Fail
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Observations
                        </h2>

                        <textarea
                            defaultValue={donorInfo.observations}
                            className="mt-[0.25in] w-full min-h-[0.25in] border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                        />

                        <div className="mt-[0.25in] flex justify-end">
                            <button
                                type="button"
                                onClick={recordDonor}
                                className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:underline"
                            >
                                Submit Record
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    );
}