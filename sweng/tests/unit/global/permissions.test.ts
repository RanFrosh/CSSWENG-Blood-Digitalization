import { hasPermission, Actions } from "@/app/global/access/permissions";
import { AccessType } from "@/db/enums/access_level";

describe("hasPermission", () => {
    it("always allows super_admin, regardless of the action", () => {
        // Includes an action with an empty allow-list to prove the super_admin bypass runs before the list lookup
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
        ["retrieve_donors", ["med_prof"]],
        ["edit_donor", ["med_prof"]],
        ["view_event", ["onsite_admin", "med_prof", "director", "super_admin"]],
        ["create_event", ["onsite_admin", "med_prof", "director", "super_admin"]],
        [
            "view_correct_event",
            ["onsite_admin", "med_prof", "director", "super_admin"],
        ],
        [
            "create_correct_event",
            ["onsite_admin", "med_prof", "director", "super_admin"],
        ],
        ["view_analytics", ["director"]],
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