"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { create_account, AppRole } from "../back/create_account/create_account";
import Header from "@/components/HeaderLanding";

export default function SignUpPage() {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "onsite_admin" as AppRole, // Default to lowest staff tier
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const result = await create_account(
            formData.name, 
            formData.email, 
            formData.role, 
            formData.password
        );

        if (result.success) {
            setSuccessMsg(`Successfully created ${formData.role} account for ${formData.name}`);
            setFormData({ name: "", email: "", password: "", role: "onsite_admin" });
        } else {
            setErrorMsg(result.message);
        }
        setIsLoading(false);
    };

    return (
        
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black items-center justify-center p-6">
            
            <div className="w-full max-w-[500px] bg-white border-2 border-[#c0cad0] rounded-[16px] p-8 shadow-sm">
                
                <div className="text-center mb-8 border-b-2 border-gray-100 pb-5">
                    <h1 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Sign Up
                    </h1>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-[10px] text-[14px] font-medium">
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-[10px] text-[14px] font-medium">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSignup} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-[#002940]">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full h-[50px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[16px] outline-none focus:border-[#002940] transition"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-[#002940]">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full h-[50px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[16px] outline-none focus:border-[#002940] transition"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-[#002940]">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full h-[50px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[16px] outline-none focus:border-[#002940] transition"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                        <label className="text-[16px] font-semibold text-[#002940]">Role</label>
                        <select 
                            className="w-full h-[50px] border-2 border-[#c0cad0] bg-white rounded-[10px] px-4 text-[16px] outline-none focus:border-[#002940] transition"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value as AppRole})}
                        >
                            {/* NO DONOR OPTION HERE */}
                            <option value="onsite_admin">Onsite Admin (Can register donors)</option>
                            <option value="med_prof">Medical Professional (Blood tests)</option>
                            <option value="director">Director (Analytics access)</option>
                            <option value="staff_admin">Staff Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] mt-2 bg-[#002940] text-white rounded-[10px] text-[18px] font-semibold hover:bg-[#001a29] transition disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? "Processing..." : "Create Staff Account"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => router.push("/landing")}
                        className="text-[16px] font-semibold text-[#002940] hover:underline"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        </main>
    );
}