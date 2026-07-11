"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderOA";

type DonorAnalytics = {
    id: string;
    name: string;
    sex: string;
    bloodType: string;
    location: string;
    latestDonation: string;
    image: string;
};

const donors: DonorAnalytics[] = [
    {
        id: "D-001",
        name: "John Doe",
        sex: "Male",
        bloodType: "O+",
        location: "Manila",
        latestDonation: "XX/XX/XXXX",
        image: "/images/user.png",
    },
    {
        id: "D-002",
        name: "Jason Doe",
        sex: "Male",
        bloodType: "A+",
        location: "San Juan",
        latestDonation: "XX/XX/XXXX",
        image: "/images/user.png",
    },
    {
        id: "D-003",
        name: "Jean Doe",
        sex: "Female",
        bloodType: "B+",
        location: "Makati",
        latestDonation: "XX/XX/XXXX",
        image: "/images/user.png",
    },
    {
        id: "D-004",
        name: "Jack Doe",
        sex: "Male",
        bloodType: "AB+",
        location: "Taguig",
        latestDonation: "XX/XX/XXXX",
        image: "/images/user.png",
    },
    {
        id: "D-005",
        name: "June Doe",
        sex: "Female",
        bloodType: "O-",
        location: "Pasay",
        latestDonation: "XX/XX/XXXX",
        image: "/images/user.png",
    },
];

export default function DonorSearchPage() {
    const router = useRouter();

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Onsite Admin
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Search
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Search Donors
                    </h2>

                    <div className="mt-5 flex flex-row items-end gap-5">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>

                            <input
                                type="text"
                                placeholder="Input donor name"
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>Default</option>
                                <option>Sex</option>
                                <option>Blood Type</option>
                                <option>Location</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Donors
                        </h2>

                        <p className="text-[18px] text-[#002940]">
                            Showing {donors.length} donor/s
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {donors.slice(0, 5).map((donor) => (
                            <div
                                key={donor.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center gap-4 flex-wrap">
                                    <img
                                        src={donor.image}
                                        alt={donor.name}
                                        className="w-[60px] h-[60px] rounded-full bg-white object-cover border-2 border-white"
                                    />

                                    <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                        {donor.name}
                                    </h2>
                                </div>

                                <div className="p-[0.35in]">
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Sex:
                                            </span>{" "}
                                            {donor.sex}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Blood Type:
                                            </span>{" "}
                                            {donor.bloodType}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Location:
                                            </span>{" "}
                                            {donor.location}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Latest Donation:
                                            </span>{" "}
                                            {donor.latestDonation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page 1
                        </p>

                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}