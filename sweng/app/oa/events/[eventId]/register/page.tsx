"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/HeaderOA";
import { register_new_donor } from "@/app/onsite_admin/action";

export default function RegisterPage() {
    
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        fname: "",
        mname: "",
        lname: "",
        age: "",
        birthdate: "",
        sex: "",
        blood: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        province: "",
        zip: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");


        if (!formData.sex || !formData.blood) {
            setErrorMsg("Please select both Sex and Blood Type.");
            setIsLoading(false);
            return;
        }

        const result = await register_new_donor(formData);

        if (result.success) {

            if (eventId) {
                router.push(`/oa/events/${eventId}/scanner`);
            } else {
                router.push("/oa/events");
            }
        } else {
            setErrorMsg(result.message || "Failed to register donor.");
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[16px] font-['Montserrat'] text-[#002940]">
                        Onsite Admin
                    </p>
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Registration
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div>
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donor Information
                        </h2>
                        {errorMsg && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-[10px] font-medium">
                                {errorMsg}
                            </div>
                        )}
                    </div>

                    {/* Notice this is now onSubmit, not onClick */}
                    <form onSubmit={handleRegister} className="mt-[0.35in] flex flex-col gap-[0.35in]">
                        
                        {/* Name Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Name
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="fname" className="text-[18px] font-semibold text-[#002940]">First Name</label>
                                    <input id="fname" type="text" required value={formData.fname} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="mname" className="text-[18px] font-semibold text-[#002940]">Middle Name</label>
                                    <input id="mname" type="text" value={formData.mname} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="lname" className="text-[18px] font-semibold text-[#002940]">Last Name</label>
                                    <input id="lname" type="text" required value={formData.lname} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                            </div>
                        </div>

                        {/* Basic Information Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="age" className="text-[18px] font-semibold text-[#002940]">Age</label>
                                    <input id="age" type="number" required value={formData.age} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="birthdate" className="text-[18px] font-semibold text-[#002940]">Birth Date</label>
                                    <input id="birthdate" type="date" required value={formData.birthdate} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <p className="text-[18px] font-semibold text-[#002940]">Sex</p>
                                    <div className="flex flex-row gap-[0.25in] text-[18px]">
                                        <div className="flex flex-row items-center gap-[8px]">
                                            <input type="radio" name="sex" id="male" value="Male" onChange={handleRadioChange} checked={formData.sex === "Male"} />
                                            <label htmlFor="male">Male</label>
                                        </div>
                                        <div className="flex flex-row items-center gap-[8px]">
                                            <input type="radio" name="sex" id="female" value="Female" onChange={handleRadioChange} checked={formData.sex === "Female"} />
                                            <label htmlFor="female">Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blood Type Field */}
                        <div>
                            <h3 className="text-[22px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">Blood Type</h3>
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in]">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-[0.15in] text-[18px]">
                                    {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((type) => (
                                        <div key={type} className="flex flex-row items-center gap-[8px]">
                                            <input 
                                                type="radio" 
                                                name="blood" 
                                                id={type} 
                                                value={type} 
                                                onChange={handleRadioChange}
                                                checked={formData.blood === type}
                                            />
                                            <label htmlFor={type}>{type}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="email" className="text-[18px] font-semibold text-[#002940]">Email Address</label>
                                    <input id="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="mobile" className="text-[18px] font-semibold text-[#002940]">Mobile Number</label>
                                    <input id="mobile" type="tel" required value={formData.mobile} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">Address</h3>
                            <div className="grid grid-cols-1 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="address" className="text-[18px] font-semibold text-[#002940]">Address</label>
                                    <input id="address" type="text" required value={formData.address} onChange={handleChange} placeholder="House no., building, street no..." className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                    <div className="flex flex-col gap-[5px]">
                                        <label htmlFor="city" className="text-[18px] font-semibold text-[#002940]">City</label>
                                        <input id="city" type="text" required value={formData.city} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <label htmlFor="province" className="text-[18px] font-semibold text-[#002940]">Province</label>
                                        <input id="province" type="text" required value={formData.province} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <label htmlFor="zip" className="text-[18px] font-semibold text-[#002940]">Zip Code</label>
                                        <input id="zip" type="text" required value={formData.zip} onChange={handleChange} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-row justify-end pt-[0.15in]">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#001a29] transition disabled:opacity-70 flex justify-center"
                            >
                                {isLoading ? "Saving..." : "Register Donor"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
    
}
