"use client"
import { useRouter } from 'next/navigation';

export default function Header() {

    const router = useRouter();

    const goHome = () => {
        router.push('/'); 
    };

    return (

        <div className = "h-[0.75in] border-b-[5px] border-b-[#c15555]">

            <div className = "p-[0.125in] gap-[0.25in] flex flex-row items-center">

                <img 
                    className = "h-[0.5in]" 
                    src = "/images/logo.png" 
                    onClick = {goHome}
                />

                <div className = "text-[30px] text-[#8a2d2d] hover:underline">
                    <h1>Red Bank Foundation</h1>
                </div>

            </div>

        </div>
    );
}