"use client";
import { useState } from "react";

import Header from "@/components/HeaderSA";

type UserRole = "SA" | "RBD" | "RS" | "LS" | "MP" | "OA" | "D";
type UserStatus = "Active" | "Inactive";

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
        role: "SA",
        status: "Active",
        dateJoined: "2026-01-04",
    },
    {
        id: "MP-001",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        role: "MP",
        status: "Active",
        dateJoined: "2026-02-12",
    },
    {
        id: "MP-002",
        name: "Jason Doe",
        email: "jason.doe@example.com",
        role: "MP",
        status: "Inactive",
        dateJoined: "2026-03-02",
    },
    {
        id: "OA-001",
        name: "Red Cross Chapter",
        email: "redcross.chapter@example.com",
        role: "OA",
        status: "Active",
        dateJoined: "2026-04-18",
    },
    {
        id: "D-005",
        name: "June Doe",
        email: "june.doe@example.com",
        role: "D",
        status: "Active",
        dateJoined: "2026-05-30",
    },
];

type TabFilter = "All" | UserRole
type SortOption =
    | "Default"
    | "Name: A-Z"
    | "Date Joined: Earliest"
    | "Date Joined: Latest"
    | "Role: A-Z"
    | "Status";

export default function SAUsersPage() {
    const [users, setUsers] = useState<SystemUser[]>(initialUsers);
    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);

    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState<UserRole>("SA");
    const [inviteError, setInviteError] = useState("");

    const tabs: TabFilter[] = [
        "All",
        "SA",
        "RBD",
        "RS",
        "LS",
        "MP",
        "OA",
        "D",
    ];

    const sortOptions: SortOption[] = [
        "Default",
        "Name: A-Z",
        "Date Joined: Earliest",
        "Date Joined: Latest",
        "Role: A-Z",
        "Status",
    ];

    let filteredUsers = [...users];

    if (activeTab !== "All") {
        filteredUsers = filteredUsers.filter((user) => user.role === activeTab);
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();

        filteredUsers = filteredUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query) ||
                user.id.toLowerCase().includes(query)
        );
    }

    filteredUsers.sort((a, b) => {
        if (sortBy === "Name: A-Z") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "Date Joined: Earliest") {
            return a.dateJoined.localeCompare(b.dateJoined);
        } else if (sortBy === "Date Joined: Latest") {
            return b.dateJoined.localeCompare(a.dateJoined);
        } else if (sortBy === "Role: A-Z") {
            return a.role.localeCompare(b.role);
        } else if (sortBy === "Status") {
            return a.status.localeCompare(b.status);
        }

        return 0;
    });

    const openCreateModal = () => {
        setFormEmail("");
        setFormRole("SA");
        setInviteError("");
        setIsUserModalOpen(true);
    };

    const handleGenerateLink = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUserModalOpen(false);
    };

    const confirmDelete = () => {
        if (!userToDelete) {
            return;
        }

        setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
        setUserToDelete(null);
    };

    const getTabClass = (tab: TabFilter) => {
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
        let className = "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";

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
                        User Management
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                System Users
                            </h2>
                        </div>

                        <div className="flex flex-row items-center flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={getTabClass(tab)}
                                >
                                    {tab}
                                </button>
                            ))}

                            <button
                                onClick={openCreateModal}
                                className="px-[20px] py-[10px] rounded-full bg-[#002940] border-2 border-[#002940] text-white font-bold text-[16px] cursor-pointer hover:bg-white hover:text-[#002940] transition"
                            >
                                + Invite User
                            </button>
                        </div>
                    </div>

                    <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                        <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                            Filters
                        </h3>

                        <div className="flex flex-row items-center justify-between flex-wrap gap-[0.2in]">
                            <div className="flex-1 min-w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Search by
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Input name, email, or ID"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                />
                            </div>

                            <div className="w-full sm:w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Sort By
                                </label>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value as SortOption)
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredUsers.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No users found
                                </p>

                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term, sort option, or tab filter.
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

                                            <span className="px-[12px] py-[6px] rounded-full text-[14px] font-semibold bg-white text-[#002940]">
                                                {user.role}
                                            </span>
                                        </div>

                                        <div className="flex flex-row gap-[10px]">
                                            <button
                                                onClick={() => setUserToDelete(user)}
                                                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#a32626] cursor-pointer hover:bg-[#fef2f2]"
                                            >
                                                Delete User
                                            </button>
                                        </div>
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

            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Generate Sign up Link
                        </h2>

                        <form onSubmit={handleGenerateLink} className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={formEmail}
                                    onChange={(event) => setFormEmail(event.target.value)}
                                    placeholder="e.g. staff@example.com"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Assigned Role
                                </label>

                                <select
                                    required
                                    value={formRole}
                                    onChange={(event) => setFormRole(event.target.value as UserRole)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    <option value="SA">Super Admin</option>
                                    <option value="RBD">Red Bank Director</option>
                                    <option value="RS">Recovery Staff</option>
                                    <option value="LS">Lab Staff</option>
                                    <option value="MP">Medical Professional</option>
                                    <option value="OA">Onsite Admin</option>
                                </select>
                            </div>

                            {inviteError !== "" && (
                                <div className="bg-[#f5e4e4] border-2 border-[#a32626] rounded-[10px] px-[12px] py-[10px]">
                                    <p className="text-[16px] font-semibold text-[#a32626]">
                                        {inviteError}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Signup Link
                                </label>

                                <div className="flex flex-row gap-[10px]">
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Add link here :D"
                                        className="flex-1 border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none bg-[#f9fdff]"
                                    />

                                    <button
                                        type="button"
                                        // onClick for copy lol
                                        className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="mt-[0.2in] flex flex-row justify-end gap-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                >
                                    Generate Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Delete this user?
                        </h2>

                        <p className="mt-[0.15in] text-[16px] text-[#002940]">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{userToDelete.name}</span>? This
                            action is permanent and cannot be undone.
                        </p>

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:opacity-90"
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