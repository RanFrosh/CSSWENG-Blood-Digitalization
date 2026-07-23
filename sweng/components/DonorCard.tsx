"use client";

import { ViewDonor } from "@/types/donor_type";

interface DonorCardProps {
    donor: ViewDonor;
    onViewAnalytics: (id: string) => void;
}

export default function DonorCard({ donor, onViewAnalytics }: DonorCardProps) {

    const safeId = donor.id?.toString();

    return (
        <div className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
            {/* Header Area */}
            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                    
                <h2 className="text-[24px] font-['Montserrat'] font-bold">
                    Donor ID: #{safeId}
                </h2>

                <button
                    type="button"
                    onClick={() => onViewAnalytics(safeId)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] transition hover:bg-gray-200 cursor-pointer"
                >
                    View Analytics
                </button>
            </div>

            {/* Body Area */}
            <div className="p-[0.35in]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">

                    {/* Basic Demographics */}
                    <p>
                        <span className="font-semibold text-[#002940]">Blood Type: </span> 
                        <span className="font-bold text-[#fd5448] text-xl">{donor.blood || "N/A"}</span>
                        {donor.verifiedBlood && (
                            <span className="ml-2 text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase font-bold align-middle">
                                Verified
                            </span>
                        )}
                    </p>
                    
                    <p>
                        <span className="font-semibold text-[#002940]">Sex: </span> 
                        {donor.sex}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Age: </span> 
                        {donor.age}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Blood Status: </span>{" "}
                        {donor.verifiedBlood ? "Verified" : "Unverified"}
                    </p>
                </div>
            </div>
        </div>
    );
}