"use client"

type DonorCard = {
    name: string;
    email: string;
    onClick?: () => void;
};

export default function DonorCard({ name, email, onClick }: DonorCard) {
    return (
        <div
            className="h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625] cursor-pointer"
            onClick={onClick}
        >
            <div className="h-[1in] pl-[0.125in] pt-[0.25in] flex">
                <img src="/images/user.png" alt="User icon" />
            </div>

            <div className="flex flex-col justify-center">
                <h3 className="font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">
                    {name}
                </h3>

                <p className="text-[#f9fdff] text-[21px]">
                    {email}
                </p>
            </div>
        </div>
    );
}