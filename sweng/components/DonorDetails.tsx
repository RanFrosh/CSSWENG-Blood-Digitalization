"use client";

export interface DonorDetails {
    id: string;
    name: string;
    sex: string;
    bloodType: string;
    age: number;
    email: string;
    mobile_no: string;
    location: string;
    verifiedBlood: boolean;
    active: boolean;
    height: number;
    weight: number;
    assessment_status: string;
}

const getEligibility = (donor: any) => {

    if (donor.permanentlyDeferred) 
        return { label: "Permanently Ineligible", color: "text-red-800" };

    if (donor.active === false) 
        return { label: "Inactive", color: "text-gray-600" };
    
    // First-time donors (no date set yet)
    if (!donor.nextEligibleDate) 
        return { label: "Eligible to Donate", color: "text-green-700" };

    const today = new Date();
    const eligibleDate = new Date(donor.nextEligibleDate);

    today.setHours(0, 0, 0, 0);
    eligibleDate.setHours(0, 0, 0, 0);

    if (eligibleDate > today) {
        return { label: "In Recovery Window", color: "text-yellow-800" };
    } else {
        return { label: "Eligible to Donate", color: "text-green-700" };
    }
};

export default function DonorDetails({ donor }: { donor: DonorDetails }) {
    
    if (!donor) 
        return null;

    const eligibility = getEligibility(donor)

    return (

        <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">

            <div className="flex flex-row items-center justify-between gap-5 flex-wrap border-b-2 border-gray-100 pb-4">
                <div>
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Details
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Donor ID Pill */}
                    <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                        Donor ID: {donor.id}
                    </span>
                </div>
            </div>

            {/* Bottom Row: Expanded Demographics */}
            <div className="mt-[0.25in] grid grid-cols-3 md:grid-cols-3 gap-x-[0.5in] gap-y-[0.25in] text-[18px]">
                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Blood Type:</span> 
                    <span className="font-bold text-[#fd5448] text-xl">{donor.bloodType || "N/A"}</span>
                    {donor.verifiedBlood && (
                        <span className="ml-2 text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase font-bold align-middle">
                            Verified
                        </span>
                    )}
                </p>

                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Age:</span> 
                    <span className="font-semibold text-[#002940]">{donor.age || "N/A"}</span>
                </p>
                
                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Sex:</span> 
                    <span className="font-semibold text-[#002940]">{donor.sex || "N/A"}</span>
                </p>

                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Eligibility:</span> 
                    
                    <span className={`font-semibold ${eligibility.color}`}>
                        {eligibility.label}
                    </span>
                </p>

                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Height: </span> 
                    <span className="font-semibold text-[#002940]">{donor.height} cm</span>
                </p>

                <p>
                    <span className="font-semibold text-gray-500 text-sm uppercase block tracking-wider">Weight: </span> 
                    <span className="font-semibold text-[#002940]">{donor.weight} kg</span>
                </p>


            </div>
        </section>
    );
}