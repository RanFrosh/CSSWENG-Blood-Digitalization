import { createServerClient } from '@supabase/ssr' 
import { cookies } from 'next/headers'
import { login, logout } from './back/login_logout/auth' 

export default async function TestPage() {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, 
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    return (
        <main className="p-10 font-mono text-black">
            
            <h1 className="text-3xl font-bold mb-6">Auth Tester</h1>
            
            <div className="p-4 bg-gray-100 rounded-lg mb-8 border border-gray-300">
                <h2 className="font-bold text-lg mb-2">Status:</h2>
                {session ? (
                    <p className="text-green-700 font-bold">✅ Logged in as: {session.user.email}</p>
                ) : (
                    <p className="text-red-500 font-bold">❌ No active session</p>
                )}
            </div>

            <div className="flex flex-row gap-8">

                {/* Login Form */}
                <form 
                    action={async (formData) => {
                        "use server";
                        await login(formData);
                    }} 
                    className="flex flex-col gap-3 p-6 border-2 border-black rounded-lg w-[300px]"
                >
                    <h2 className="font-bold text-xl border-b pb-2">Log In</h2>
                    <input type="email" name="email" placeholder="Email" className="p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password" className="p-2 border rounded" required />
                    <button type="submit" className="bg-[#8a2d2d] text-white p-2 rounded font-bold hover:bg-red-800 transition-colors">Submit</button>
                </form>

                {/* Logout Form */}
                <form 
                    action={async () => {
                        "use server";
                        await logout();
                    }} 
                    className="flex flex-col gap-3 p-6 border-2 border-black rounded-lg w-[300px]"
                >
                    <h2 className="font-bold text-xl border-b pb-2">Log Out</h2>
                    <button type="submit" className="bg-gray-800 text-white p-2 rounded font-bold hover:bg-black transition-colors">Sign Out</button>
                </form>
            </div>

        </main>
    );
}