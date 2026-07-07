"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";

type UserRole = "Super Admin" | "Medical Professional" | "Onsite Admin" | "Donor"; 
type UserStatus = "Active" | "Inactive";
type RoleTab = UserRole | "All";

type SystemUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    dateJoined: string;
};

const initialUsers: SystemUser[] = [
    {
        id: "SA-001",
        name: "Alex Cruz",
        email: "alex.cruz@example.com",
        role: "Super Admin",
        status: "Active",
        dateJoined: "Jan 4, 2026",
    },
    {
        id: "MP-001",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        role: "Medical Professional",
        status: "Active",
        dateJoined: "Feb 12, 2026",
    },
    {
        id: "MP-002",
        name: "Jason Doe",
        email: "jason.doe@example.com",
        role: "Medical Professional",
        status: "Inactive",
        dateJoined: "Mar 2, 2026",
    },
    {
        id: "PT-001",
        name: "Red Cross Chapter",
        email: "redcross.chapter@example.com",
        role: "Onsite Admin",
        status: "Active",
        dateJoined: "Apr 18, 2026",
    },
    {
        id: "D-005",
        name: "June Doe",
        email: "june.doe@example.com",
        role: "Donor",
        status: "Active",
        dateJoined: "May 30, 2026",
    },
];

export default function SAUsersPage() {
    const [users, setUsers] = useState<SystemUser[]>(initialUsers);

    const [activeTab, setActiveTab] = useState<RoleTab>("All");

    const [search, setSearch] = useState("");

    const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);

    const tabs: RoleTab[] = ["All", "Super Admin", "Medical Professional", "Onsite Admin", "Donor"];

    let filteredUsers: SystemUser[] = users;

    if (activeTab !== "All") {
        filteredUsers = filteredUsers.filter((user) => user.role === activeTab);
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filteredUsers = filteredUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.id.toLowerCase().includes(query)
        );
    }

    const requestDelete = (user: SystemUser) => {
        setUserToDelete(user);
    };

    const cancelDelete = () => {
        setUserToDelete(null);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;

        setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
        setUserToDelete(null);
    };

    const getTab = (tab: RoleTab) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const getStatusPill = (status: UserStatus) => {
        let className =
            "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";

        if (status === "Active") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else {
            className += "bg-[#f5e4e4] text-[#a32626]";
        }

        return className;
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Super Admin
                    </p>

                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Manage Users
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                All Users
                            </h2>
                        </div>

                        <div className="flex flex-row flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                    }}
                                    className={getTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[0.25in]">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name, email, or ID"
                            className="w-full max-w-[4in] border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none focus:border-[#002940]"
                        />
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredUsers.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No users found
                                </p>
                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term or filter.
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                                {user.name}
                                            </h2>

                                            <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                                {user.role}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => requestDelete(user)}
                                            className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#a32626] cursor-pointer hover:underline"
                                        >
                                            Delete User
                                        </button>
                                    </div>

                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    User ID:
                                                </span>{" "}
                                                {user.id}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Email:
                                                </span>{" "}
                                                {user.email}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Date Joined:
                                                </span>{" "}
                                                {user.dateJoined}
                                            </p>

                                            <p className="flex items-center gap-[10px]">
                                                <span className="font-semibold text-[#002940]">
                                                    Status:
                                                </span>{" "}
                                                <span className={getStatusPill(user.status)}>
                                                    {user.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {userToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Delete this user?
                        </h2>

                        <p className="mt-[0.15in] text-[16px] text-[#002940]">
                            This will permanently remove{" "}
                            <span className="font-semibold">{userToDelete.name}</span> ({userToDelete.email})
                            from the system. This action cannot be undone.
                        </p>

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={cancelDelete}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:underline"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}