import Link from "next/link";

interface AccessDeniedProps {
    requiredRole: string;
    currentRole?: string;
    returnUrl?: string;
}

export default function AccessDenied({ 
    requiredRole, 
    currentRole, 
    returnUrl = "/landing" 
}: AccessDeniedProps) {
    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black items-center justify-center p-8">
            <div className="bg-white border-2 border-red-200 rounded-2xl p-10 max-w-lg w-full text-center shadow-lg">
                <h1 className="text-4xl font-bold text-red-600 mb-4 font-['Montserrat']">
                    Access Denied
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    This page is restricted to <span className="font-bold">{requiredRole}</span> only. <br></br>
                    Your current role is: <span className="font-bold uppercase">{currentRole || "Unknown"}</span>.
                </p>
                <Link 
                    href={returnUrl} 
                    className="bg-[#002940] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#013a5a] transition-colors inline-block"
                >
                    Return to Landing Page
                </Link>
            </div>
        </main>
    );
}