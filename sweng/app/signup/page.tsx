"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { finishRegistration } from "../register/register_action";
import { useEffect } from "react";
import { clientSupa } from "@/db/supaclient";

export default function SignUpPage() {    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });

    useEffect(() => {
        const initSession = async () => {
            const supabase = await clientSupa();
            const { data } = await supabase.auth.getSession();
            if (!data.session) setErrorMsg("Invalid or expired invite link");
        };
        initSession();
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const result = await finishRegistration(formData.name, formData.password);

        if (result.success) {
            setSuccessMsg(`Successfully registered ${formData.name}`);
            setFormData({ name: "", password: ""});
            router.push("/landing");          
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
                        Name and Password Setup
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] mt-2 bg-[#002940] text-white rounded-[10px] text-[18px] font-semibold hover:bg-[#001a29] transition disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? "Processing..." : "Complete Registration"}
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