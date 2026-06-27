import { ExecutionContext } from "@nestjs/common";
import { PermissionsGuard } from "./permission.quard";

function contextWithUser(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("PermissionsGuard", () => {
  it("allows super admin regardless of explicit permissions", () => {
    const Guard = PermissionsGuard("manage-fleet");
    const guard = new Guard();

    expect(
      guard.canActivate(
        contextWithUser({
          role: { key: "super_admin" },
          permissions: [],
        })
      )
    ).toBe(true);
  });

  it("allows users with any matching permission", () => {
    const Guard = PermissionsGuard("manage-fleet|view-fleet");
    const guard = new Guard();

    expect(
      guard.canActivate(
        contextWithUser({
          role: { key: "dispatcher" },
          permissions: ["view-fleet"],
        })
      )
    ).toBe(true);
  });

  it("denies users without required permissions", () => {
    const Guard = PermissionsGuard("manage-fleet");
    const guard = new Guard();

    expect(
      guard.canActivate(
        contextWithUser({
          role: { key: "dispatcher" },
          permissions: ["view-fleet"],
        })
      )
    ).toBe(false);
  });
});
