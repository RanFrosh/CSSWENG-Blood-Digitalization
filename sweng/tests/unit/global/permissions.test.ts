import { hasPermission, getQueueStation, Actions } from "@/utils/access/permissions";
import { AccessType } from "@/db/enums/access_level";

describe("hasPermission", () => {
    it("always allows super_admin, regardless of the action", () => {
        // includes an action with an empty allow-list to prove the super_admin bypass runs before the list lookup
        expect(hasPermission("super_admin", "delete_donor")).toBe(true);
    });

    it("denies delete_donor to every non-super_admin role", () => {
        const roles: AccessType[] = [
            "donor",
            "onsite_admin",
            "med_prof",
            "director",
            "lab_staff",
            "recov_staff",
        ];

        for (const role of roles) {
            expect(hasPermission(role, "delete_donor")).toBe(false);
        }
    });

    it("denies a role that is not on the action's allow-list", () => {
        expect(hasPermission("onsite_admin", "retrieve_donors")).toBe(false);
    });

    it("falls back to false for an action with no defined permissions", () => {
        expect(hasPermission("director", "not_a_real_action" as Actions)).toBe(
            false
        );
    });

    // role x action permission matrix based on allowable actions per role in permissions.ts
    describe.each([
        // donor operations
        ["retrieve_donors", ["med_prof"]],
        ["edit_donor", ["med_prof"]],
        ["viewdonor", ["med_prof", "lab_staff"]],

        // event operations
        ["view_event", ["onsite_admin", "med_prof", "director", "lab_staff", "super_admin"]],
        ["create_event", ["onsite_admin", "med_prof", "director", "super_admin"]],
        ["view_correct_event", ["onsite_admin", "med_prof", "director", "super_admin"]],
        ["create_correct_event", ["onsite_admin", "med_prof", "director", "super_admin"]],

        // analytics
        ["view_analytics", ["director"]],

        // queue operations
        ["enqueue", ["onsite_admin"]],
        ["dequeue", ["onsite_admin", "med_prof", "recov_staff", "lab_staff"]],
        ["updatequeue", ["med_prof", "lab_staff"]],
        ["viewqueue", ["med_prof", "lab_staff"]],

        // staff operations
        ["viewprofiles", ["med_prof", "lab_staff"]],
        ["view_assigned_staff", ["med_prof", "lab_staff"]],

        // page access permissions — these enforce role-based page restrictions
        // note: URL bypass means these are currently only enforced at the UI level
        ["access_oa_page", ["onsite_admin"]],
        ["access_mp_page", ["med_prof"]],
        ["access_rbd_page", ["director"]],
        ["access_sa_page", ["super_admin"]],
        ["access_ls_page", ["lab_staff"]],
        ["access_rs_page", ["recov_staff"]],

    ] as [Actions, AccessType[]][])("%s", (action, allowedRoles) => {
        const allRoles: AccessType[] = [
            "onsite_admin",
            "med_prof",
            "director",
            "lab_staff",
            "recov_staff",
            "donor",
        ];

        it(`allows: ${allowedRoles.join(", ")}`, () => {
            for (const role of allowedRoles) {
                expect(hasPermission(role, action)).toBe(true);
            }
        });

        it("denies roles not on the allow-list", () => {
            const deniedRoles = allRoles.filter(
                (role) => !allowedRoles.includes(role)
            );

            for (const role of deniedRoles) {
                expect(hasPermission(role, action)).toBe(false);
            }
        });
    });
});

describe("getQueueStation", () => {

    it("returns 'med_queue' for med_prof", () => {
        expect(getQueueStation("med_prof")).toBe("med_queue");
    });

    it("returns 'lab_queue' for lab_staff", () => {
        expect(getQueueStation("lab_staff")).toBe("lab_queue");
    });

    it("returns undefined for roles with no station mapping", () => {
        // onsite_admin has dequeue permission but no station
        expect(getQueueStation("onsite_admin")).toBeUndefined();
    });

    it("returns undefined for roles outside the queue flow", () => {
        const rolesWithNoStation: AccessType[] = [
            "director",
            "recov_staff",
            "donor",
        ];

        for (const role of rolesWithNoStation) {
            expect(getQueueStation(role)).toBeUndefined();
        }
    });
});