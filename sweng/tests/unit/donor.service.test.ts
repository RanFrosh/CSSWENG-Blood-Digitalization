import { getDonors, Filters } from "@/app/back/donor_actions/get_donors";
import { deleteDonors } from "@/app/back/donor_actions/toggle_donor"
import { serverSupa } from "@/db/supaserver";
import { getProfile } from "@/app/back/fetch_profile/single_profile";
import { orm } from "@/db/drizzle";
import { eq, and, getTableColumns } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { profiles } from "@/db/models/profiles";
import { NON_SUPER_ADMIN_ROLES } from "@/db/enums/access_level";
import type { NonSuperAdminRole } from "@/db/enums/access_level";

type Profile = InferSelectModel<typeof profiles>;
type UserId = Profile["id"];

const TEST_USER_ID: UserId = "00000000-0000-0000-0000-000000000001";

jest.mock("@/db/supaserver", () => ({ serverSupa: jest.fn() }));
jest.mock("@/app/back/fetch_profile/single_profile", () => ({
    getProfile: jest.fn(),
}));
jest.mock("@/db/models/donor", () => ({ donor: { id: "id" } }));

jest.mock("drizzle-orm", () => ({
    eq: jest.fn((col, val) => ({ eq: { col, val } })),
    and: jest.fn((...conds) => ({ and: conds })),
    inArray: jest.fn((col, vals) => ({ inArray: { col, vals } })), // added for deleteDonors
    getTableColumns: jest.fn(),
}));

describe("getDonors", () => {
    const mockGetUser = jest.fn();
    const mockWhere = jest.fn();
    const mockFrom = jest.fn();
    const mockSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (serverSupa as jest.Mock).mockResolvedValue({
            auth: { getUser: mockGetUser },
        });

        mockGetUser.mockResolvedValue({
            data: { user: { id: TEST_USER_ID } },
        });

        (getProfile as jest.Mock).mockResolvedValue({
            success: true,
            data: { role: "super_admin" },
        });

        mockWhere.mockResolvedValue([
            {
                id: BigInt(1),
                first_name: "Alice",
                last_name: "Doe",
                middle_name: null,
                email: "alice@example.com",
                mobile_no: "09171234567",
                street: "123 Main St",
                zip_code: "1000",
                sex: "female",
                blood: "O+",
                city_id: BigInt(1),
                photo_path: "/images/alice.jpg",
                height: 165.5,
                weight: 55.2,
                active: true,
            },
        ]);

        mockFrom.mockReturnValue({ where: mockWhere });
        mockSelect.mockReturnValue({ from: mockFrom });

        (orm.select as jest.Mock) = mockSelect;
    });

    it("returns error for anonymous request", async () => {
        mockGetUser.mockResolvedValueOnce({ data: { user: null } });

        const res = await getDonors();
        expect(res.success).toBe(false);
        expect(res.message).toMatch(/anonymous request/);
    });

    test.each(NON_SUPER_ADMIN_ROLES)(
        "denies access to non-admin role %s",
        async (role: NonSuperAdminRole) => {
            (getProfile as jest.Mock).mockResolvedValue({
                success: true,
                data: { role },
            });

            const res = await getDonors();
            expect(res.success).toBe(false);
            expect(res.message).toMatch(/no admin/);
        }
    );

    it("returns donors when super_admin and no filters", async () => {
        const res = await getDonors();

        expect(res?.success).toBe(true);
        expect(res.data).toEqual([
            expect.objectContaining({
                first_name: "Alice",
                last_name: "Doe",
                active: true,
            }),
        ]);
        expect(mockWhere).toHaveBeenCalledWith(undefined);
    });

    it("returns donors when super_admin and applies existing filter", async () => {
        (getTableColumns as jest.Mock).mockReturnValue({
            first_name: Symbol("col_first_name"),
        });

        await getDonors({ first_name: "Alice" });

        expect(eq).toHaveBeenCalledWith(expect.anything(), "Alice");
        expect(and).toHaveBeenCalledWith(expect.anything());
        expect(mockWhere).toHaveBeenCalled();
    });

    it("ignores a non-existing filter while applying the existing one", async () => {
        (getTableColumns as jest.Mock).mockReturnValue({
            first_name: Symbol("col_first_name"),
        });

        const filters = {
            first_name: "Alice",
            nonexist: "x",
        } as unknown as Filters;
        await getDonors(filters);

        expect(eq).toHaveBeenCalledWith(expect.anything(), "Alice");
        expect(and).toHaveBeenCalledWith(expect.anything());
        expect(mockWhere).toHaveBeenCalled();
    });
});


describe("deleteDonors", () => {
    const mockGetUser = jest.fn();

    const mockDeleteWhere = jest.fn();
    const mockDelete = jest.fn().mockReturnValue({ where: mockDeleteWhere });

    const mockUpdateWhere = jest.fn();
    const mockUpdateSet = jest.fn().mockReturnValue({ where: mockUpdateWhere });
    const mockUpdate = jest.fn().mockReturnValue({ set: mockUpdateSet });

    beforeEach(() => {
        jest.clearAllMocks();

        (serverSupa as jest.Mock).mockResolvedValue({
            auth: { getUser: mockGetUser },
        });
        mockGetUser.mockResolvedValue({
            data: { user: { id: TEST_USER_ID } },
        });

        (getProfile as jest.Mock).mockResolvedValue({
            success: true,
            data: { role: "super_admin" },
        });

        (orm.delete as jest.Mock) = mockDelete;
        (orm.update as jest.Mock) = mockUpdate;
    });

    it("returns an error when the user is anonymous", async () => {
        mockGetUser.mockResolvedValueOnce({ data: { user: null } });

        const res = await deleteDonors([1], 'soft');
        
        expect(res?.success).toBe(false);
        expect(res?.message).toMatch(/anonymous request/);
        expect(orm.update).not.toHaveBeenCalled();
        expect(orm.delete).not.toHaveBeenCalled();
    });

    
    it("executes soft delete by setting active to false for a donor that is currently active", async () => {
        const res = await deleteDonors([1], 'soft');

        expect(res?.success).toBe(true);
        expect(orm.update).toHaveBeenCalledWith({ id: "id" });
        expect(mockUpdateSet).toHaveBeenCalledWith({ active: false });
        expect(mockUpdateWhere).toHaveBeenCalledWith({
            inArray: { col: "id", vals: [BigInt(1)] } 
        });
    });

    it("executes soft delete successfully even if the profile is already inactive", async () => {
        const res = await deleteDonors([2], 'soft');
        
        expect(res?.success).toBe(true);
        expect(orm.update).toHaveBeenCalledWith({ id: "id" });
        expect(mockUpdateSet).toHaveBeenCalledWith({ active: false });
        expect(mockUpdateWhere).toHaveBeenCalledWith({
            inArray: { col: "id", vals: [BigInt(2)] } 
        });
    });
    it("permanently deletes the record when a super_admin performs a hard delete on a donor with active status set to true", async () => {
        const targetIds = [3];
        const res = await deleteDonors(targetIds, 'hard');

        expect(res?.success).toBe(true);
        expect(orm.delete).toHaveBeenCalledWith({ id: "id" });
        expect(mockDeleteWhere).toHaveBeenCalledWith({ 
            inArray: { col: "id", vals: [BigInt(3)] } 
        });
        expect(orm.update).not.toHaveBeenCalled();
    });

    it("permanently deletes the record when a super_admin performs a hard delete on a donor with active status set to false", async () => {
        
        const targetIds = [4];
        const res = await deleteDonors(targetIds, 'hard');

        expect(res?.success).toBe(true);
        expect(orm.delete).toHaveBeenCalledWith({ id: "id" });
        expect(mockDeleteWhere).toHaveBeenCalledWith({ 
            inArray: { col: "id", vals: [BigInt(4)] } 
        });
        expect(orm.update).not.toHaveBeenCalled();
    });

    it("reactives donor account by setting active to true for a profile that is currently inactive", async () => {
        const targetIds = [5];
        const res = await deleteDonors(targetIds, 'reactivate');

        expect(res?.success).toBe(true);
        expect(orm.update).toHaveBeenCalledWith({ id: "id" });
        expect(mockUpdateSet).toHaveBeenCalledWith({ active: true });
        expect(mockUpdateWhere).toHaveBeenCalledWith({ 
            inArray: { col: "id", vals: [BigInt(5)] } 
        });
        expect(orm.delete).not.toHaveBeenCalled();
    });

    it("reactivates donor account even if the profile is already active", async () => {
        const targetIds = [6];
        const res = await deleteDonors(targetIds, 'reactivate');

        expect(res?.success).toBe(true);
        expect(orm.update).toHaveBeenCalledWith({ id: "id" });
        expect(mockUpdateSet).toHaveBeenCalledWith({ active: true });
        expect(mockUpdateWhere).toHaveBeenCalledWith({ 
            inArray: { col: "id", vals: [BigInt(6)] } 
        });
        expect(orm.delete).not.toHaveBeenCalled();
    });

    test.each(NON_SUPER_ADMIN_ROLES)(
        "denies deletion actions for non-admin role %s",
        async (role: NonSuperAdminRole) => {
            (getProfile as jest.Mock).mockResolvedValue({
                success: true,
                data: { role },
            });

            const res = await deleteDonors([1], 'soft');
            
            expect(res).toBeUndefined(); 
            expect(orm.update).not.toHaveBeenCalled();
            expect(orm.delete).not.toHaveBeenCalled();
        }
    );
});