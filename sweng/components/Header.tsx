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
                    className = "h-[0.5in] w-auto cursor-pointer pl-[0.25in]" 
                    src = "/images/redbank_logo.png"
                    onClick = {goHome}
                />

            </div>

        </div>
    );
}