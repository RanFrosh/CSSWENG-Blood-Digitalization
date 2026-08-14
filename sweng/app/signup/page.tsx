"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { finishRegistration, establishInviteSession, hasInviteSession } from "../../actions/register_action";
import { useEffect } from "react";

export default function SignUpPage() {    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [inviteReady, setInviteReady] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });

    useEffect(() => {
        const raw = (window.location.search + window.location.hash).replace(/^[?#]+/, "");
        const params = new URLSearchParams(raw);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (accessToken && refreshToken) {
            establishInviteSession(accessToken, refreshToken)
                .then((result) => {
                    if (result.success) {
                        setInviteReady(true);
                    } else {
                        setErrorMsg(result.message);
                    }
                });
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        hasInviteSession()
            .then((result) => {
                if (result.success) {
                    setInviteReady(true);
                } else {
                    setErrorMsg("Invalid or missing invite link");
                }
            });
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (!inviteReady) {
            setErrorMsg("Invalid or missing invite link");
            setIsLoading(false);
            return;
        }

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
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="w-full h-[50px] border-2 border-[#c0cad0] rounded-[10px] px-4 pr-[44px] text-[16px] outline-none focus:border-[#002940] transition"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer text-[#002940] hover:text-[#fd5448] transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
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