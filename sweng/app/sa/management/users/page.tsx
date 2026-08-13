"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/HeaderSA";
import { prepareStaff, deleteStaffUser, staffToggler } from "@/app/register/register_action";
import { AccessType } from "@/db/enums/access_level";
import { StaffUser, StaffStatus } from "@/types/staff_type";
import { getUsers } from "@/actions/users_action";

type TabFilter = "All" | AccessType
type SortOption =
    | "Default"
    | "Name: A-Z"
    | "Date Joined: Earliest"
    | "Date Joined: Latest"
    | "Role: A-Z"
    | "Status";
type UserAction = "Deactivate" | "Reactivate" | "Delete";

export default function SAUsersPage() {
    const PAGE_SIZE = 8;
    const [users, setUsers] = useState<StaffUser[]>([]);
    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");
    const [page, setPage] = useState(1);

    const [usersError, setUsersError] = useState("");
    const [usersLoading, setUsersLoading] = useState(true);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Accepted HEAD changes: We are using the Modal approach
    const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
    const [selectedUserAction, setSelectedUserAction] = useState<UserAction | null>(null);

    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState<AccessType>("super_admin");
    const [inviteError, setInviteError] = useState("");
    const [inviteLink, setInviteLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);

    const roleShortLabels: Record<AccessType, string> = {
        donor: "DR",
        super_admin: "SA",
        onsite_admin: "OA",
        med_prof: "MP",
        director: "RBD",
        lab_staff: "LS",
        recov_staff: "RS",
    };

    const loadUsers = useCallback(async () => {
        setUsersLoading(true);
        const result = await getUsers();
        if (!result.success) {
            setUsersError(result.message);
            setUsers([]);
        } else {
            setUsers(result.data ?? []);
            setUsersError("");
        }
        setUsersLoading(false);
    }, []);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const tabs: { value: TabFilter; label: string }[] = [
        { value: "All", label: "All" },
        { value: "super_admin", label: "SA" },
        { value: "director", label: "RBD" },
        { value: "recov_staff", label: "RS" },
        { value: "lab_staff", label: "LS" },
        { value: "med_prof", label: "MP" },
        { value: "onsite_admin", label: "OA" },
        { value: "donor", label: "DR" },
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
                user.email?.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query) ||
                user.id.toLowerCase().includes(query)
        );
    }

    filteredUsers.sort((a, b) => {
        if (sortBy === "Name: A-Z") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "Date Joined: Earliest") {
            return (a.dateJoined?.getTime() ?? 0) - (b.dateJoined?.getTime() ?? 0);
        } else if (sortBy === "Date Joined: Latest") {
            return (b.dateJoined?.getTime() ?? 0) - (a.dateJoined?.getTime() ?? 0);
        } else if (sortBy === "Role: A-Z") {
            return a.role.localeCompare(b.role);
        } else if (sortBy === "Status") {
            return a.status.localeCompare(b.status);
        }

        return 0;
    });

    const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pagedUsers = filteredUsers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const openCreateModal = () => {
        setFormEmail("");
        setFormRole("super_admin");
        setInviteError("");
        setInviteLink("");
        setCopied(false);
        setIsUserModalOpen(true);
    };

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteLink) return;
        setInviteError("");
        if (!formEmail.trim() || !formRole) {
            setInviteError("Email address and assigned role are required.");
            return;
        }

        setInviteLoading(true);
        try {
            const result = await prepareStaff(formEmail.trim(), formRole);

            if (!result.success) {
                setInviteError(result.message);
                return;
            }

            if (result.data) {
                setInviteLink(result.data);
                return;
            }

            setIsUserModalOpen(false);
            setFormEmail("");
            loadUsers();
        } finally {
            setInviteLoading(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = inviteLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openUserActionModal = (user: StaffUser, action: UserAction) => {
        setSelectedUser(user);
        setSelectedUserAction(action);
        setDeleteError("");
    };

    const closeUserActionModal = () => {
        setSelectedUser(null);
        setSelectedUserAction(null);
        setDeleteError("");
    };

    const confirmUserAction = async () => {
        if (!selectedUser || !selectedUserAction) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError("");
        
        try {
            if (selectedUserAction === "Delete") {
                const result = await deleteStaffUser(selectedUser.id);

                if (!result.success) {
                    setDeleteError(result.message);
                    return;
                }

                setUsers((prev) =>
                    prev.filter((user) => user.id !== selectedUser.id)
                );
            } else {
                const result = await staffToggler(selectedUser.id);

                if (!result.success) {
                    setDeleteError(result.message);
                    return;
                }

                const newStatus: StaffStatus =
                    result.data === true ? "Active" : "Inactive";
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === selectedUser.id
                            ? { ...u, status: newStatus }
                            : u
                    )
                );
            }

            closeUserActionModal();
        } finally {
            setDeleteLoading(false);
        }
    };

    const getTabClass = (tab: TabFilter) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className +=
                "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const getStatusPill = (status: StaffStatus) => {
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
                                    key={tab.value}
                                    onClick={() => {
                                        setActiveTab(tab.value);
                                        setPage(1);
                                    }}
                                    className={getTabClass(tab.value)}
                                >
                                    {tab.label}
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
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
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
                                    onChange={(event) => {
                                        setSortBy(
                                            event.target.value as SortOption
                                        );
                                        setPage(1);
                                    }}
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

                    <div className="mt-[0.25in] text-[16px]">
                        <p>Showing {filteredUsers.length} result/s</p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {usersLoading ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] py-[0.5in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940] animate-pulse">
                                    Loading users...
                                </p>
                            </div>
                        ) : usersError !== "" ? (
                            <div className="bg-[#f5e4e4] border-2 border-[#a32626] rounded-[16px] py-[0.5in] text-center">
                                <p className="text-[16px] font-semibold text-[#a32626]">
                                    {usersError}
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] py-[0.5in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No users found
                                </p>
                                <p className="mt-2 text-[16px] text-[#5c6b73]">
                                    Try a different search term, sort option, or tab filter.
                                </p>
                            </div>
                        ) : (
                            pagedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.25in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[22px] font-['Montserrat'] font-bold">
                                                {user.name}
                                            </h2>
                                            <span className="px-[12px] py-[4px] rounded-full text-[13px] font-bold tracking-wide uppercase bg-white text-[#002940]">
                                                {roleShortLabels[user.role]}
                                            </span>
                                        </div>

                                        <div className="flex flex-row gap-[10px] flex-wrap w-full sm:w-auto">
                                            {user.status === "Active" ? (
                                                <button
                                                    onClick={() => openUserActionModal(user, "Deactivate")}
                                                    className="w-full sm:w-auto px-[16px] py-[8px] rounded-[10px] text-[15px] font-semibold bg-white text-[#002940] hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    Deactivate User
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => openUserActionModal(user, "Reactivate")}
                                                    className="w-full sm:w-auto px-[16px] py-[8px] rounded-[10px] text-[15px] font-semibold bg-white text-[#1a7a3f] hover:bg-[#e4f5ea] transition-colors cursor-pointer"
                                                >
                                                    Reactivate User
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => openUserActionModal(user, "Delete")}
                                                className="w-full sm:w-auto px-[16px] py-[8px] rounded-[10px] text-[15px] font-semibold bg-white text-[#a32626] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                                            >
                                                Delete User
                                            </button>
                                        </div>
                                    </div>

                                    <div className = "p-[0.35in]">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            
                                            <p>
                                                <span className="font-semibold text-[#002940]">User ID: </span>
                                                {user.id}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">Email: </span> 
                                                {user.email ?? "-"}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">Date Joined: </span>
                                                {user.dateJoined?.toLocaleDateString() ?? "-"}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">Status: </span>
                                                <span className={getStatusPill(user.status)}>{user.status}</span>
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page {currentPage} of {pageCount}
                        </p>

                        <button
                            type="button"
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage >= pageCount}
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>

            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Create Staff
                        </h2>

                        <form onSubmit={handleCreateStaff} className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={formEmail}
                                    onChange={(event) =>
                                        setFormEmail(event.target.value)
                                    }
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
                                    onChange={(event) => setFormRole(event.target.value as AccessType)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="director">Red Bank Director</option>
                                    <option value="recov_staff">Recovery Staff</option>
                                    <option value="lab_staff">Lab Staff</option>
                                    <option value="med_prof">Medical Professional</option>
                                    <option value="onsite_admin">Onsite Admin</option>
                                </select>
                            </div>

                            {inviteError !== "" && (
                                <div className="bg-[#f5e4e4] border-2 border-[#a32626] rounded-[10px] px-[12px] py-[10px]">
                                    <p className="text-[16px] font-semibold text-[#a32626]">
                                        {inviteError}
                                    </p>
                                </div>
                            )}

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
                                    disabled={inviteLoading || inviteLink !== ""}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {inviteLoading ? "Processing..." : "Create Staff"}
                                </button>
                            </div>
                        </form>

                        {inviteLink !== "" && (
                            <div className="mt-[0.2in] bg-[#e4f5ea] border-2 border-[#1a7a3f] rounded-[10px] px-[12px] py-[10px] flex flex-col gap-[10px]">
                                <p className="text-[16px] font-semibold text-[#1a7a3f]">
                                    Invite link generated. Share this link with the staff member to complete their signup.
                                </p>

                                <input
                                    readOnly
                                    value={inviteLink}
                                    onFocus={(event) => event.currentTarget.select()}
                                    className="w-full border-2 border-[#1a7a3f] rounded-[10px] px-[12px] py-[8px] text-[14px] text-[#002940] bg-white outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={copyLink}
                                    className="self-end px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#1a7a3f] text-white cursor-pointer hover:opacity-90"
                                >
                                    {copied ? "Copied!" : "Copy Link"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedUser && selectedUserAction && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            {selectedUserAction} this user?
                        </h2>

                        <p className="mt-[0.15in] text-[16px] text-[#002940]">
                            Are you sure you want to{" "}
                            {selectedUserAction.toLowerCase()}{" "}
                            <span className="font-semibold">
                                {selectedUser.name}
                            </span>
                            ?
                            {selectedUserAction === "Deactivate" &&
                                " This will mark the user as inactive without deleting the account."}
                            {selectedUserAction === "Reactivate" &&
                                " This will restore the user's active status."}
                            {selectedUserAction === "Delete" &&
                                " This action is permanent and cannot be undone."}
                        </p>

                        {deleteError !== "" && (
                            <div className="mt-[0.2in] bg-[#f5e4e4] border-2 border-[#a32626] rounded-[10px] px-[12px] py-[10px]">
                                <p className="text-[16px] font-semibold text-[#a32626]">
                                    {deleteError}
                                </p>
                            </div>
                        )}

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={closeUserActionModal}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmUserAction}
                                disabled={deleteLoading}
                                className={`px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    selectedUserAction === "Reactivate"
                                        ? "bg-[#1a7a3f]"
                                        : "bg-[#a32626]"
                                }`}
                            >
                                {deleteLoading
                                    ? "Processing..."
                                    : `Confirm ${selectedUserAction}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}