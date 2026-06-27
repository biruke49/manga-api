import { AccountsController } from "./account.controller";
import { RolesController } from "./role.controller";

const currentUser = {
  id: "admin-id",
  role: { id: "role-id", key: "super_admin", name: "Super Admin" },
  permissions: [
    "manage-account-roles",
    "manage-account-permissions",
    "manage-roles",
    "manage-permissions",
  ],
};

describe("Account and role workflow controllers", () => {
  describe("AccountsController", () => {
    const commands = {
      addAccountRole: jest.fn(),
      deleteAccountRole: jest.fn(),
      archiveAccountRole: jest.fn(),
      restoreAccountRole: jest.fn(),
      addAccountPermission: jest.fn(),
      deleteAccountPermission: jest.fn(),
      archiveAccountPermission: jest.fn(),
      restoreAccountPermission: jest.fn(),
      sendAccountCredentials: jest.fn(),
    };
    const queries = {
      getAccount: jest.fn(),
      getAccounts: jest.fn(),
      getArchivedAccounts: jest.fn(),
      getRolesByAccountId: jest.fn(),
      getPermissionsByAccountId: jest.fn(),
      getPermissionsByAccountIdAndRoleId: jest.fn(),
    };
    let controller: AccountsController;

    beforeEach(() => {
      jest.clearAllMocks();
      controller = new AccountsController(commands as never, queries as never);
    });

    it("assigns roles with current user context", async () => {
      const command = { accountId: "account-id", roleIds: ["role-id"] };
      commands.addAccountRole.mockResolvedValue([{ id: "role-id" }]);

      await controller.addDriverAccountRole(currentUser as never, command as never);

      expect(command).toMatchObject({ currentUser });
      expect(commands.addAccountRole).toHaveBeenCalledWith(command);
    });

    it("assigns direct permissions with current user context", async () => {
      const command = {
        accountId: "account-id",
        roleId: "role-id",
        permissionIds: ["permission-id"],
      };
      commands.addAccountPermission.mockResolvedValue([{ id: "permission-id" }]);

      await controller.addDriverAccountPermission(
        currentUser as never,
        command as never
      );

      expect(command).toMatchObject({ currentUser });
      expect(commands.addAccountPermission).toHaveBeenCalledWith(command);
    });

    it("loads role-scoped user permissions through the API query", async () => {
      const collectionQuery = { top: 50 };
      queries.getPermissionsByAccountIdAndRoleId.mockResolvedValue([
        { key: "manage-fleet" },
      ]);

      await controller.getUserPermissionsByRoleId(
        "account-id",
        "role-id",
        collectionQuery as never
      );

      expect(queries.getPermissionsByAccountIdAndRoleId).toHaveBeenCalledWith(
        "account-id",
        "role-id",
        collectionQuery
      );
    });
  });

  describe("RolesController", () => {
    const commands = {
      createRole: jest.fn(),
      updateRole: jest.fn(),
      archiveRole: jest.fn(),
      deleteRole: jest.fn(),
      restoreRole: jest.fn(),
      addRolePermission: jest.fn(),
      deleteRolePermission: jest.fn(),
      archiveRolePermission: jest.fn(),
      restoreRolePermission: jest.fn(),
    };
    const queries = {
      getRole: jest.fn(),
      getRoles: jest.fn(),
      getArchivedRoles: jest.fn(),
      getRolePermission: jest.fn(),
      getRolePermissions: jest.fn(),
      getArchivedRolePermissions: jest.fn(),
      getPermissionsByRoleId: jest.fn(),
    };
    let controller: RolesController;

    beforeEach(() => {
      jest.clearAllMocks();
      controller = new RolesController(commands as never, queries as never);
    });

    it("creates roles with current user context", async () => {
      const command = { name: "Fleet Manager", key: "fleet-manager" };
      commands.createRole.mockResolvedValue({ id: "role-id" });

      await controller.createRole(currentUser as never, command as never);

      expect(command).toMatchObject({ currentUser });
      expect(commands.createRole).toHaveBeenCalledWith(command);
    });

    it("edits role permissions with current user context", async () => {
      const command = { roleId: "role-id", permissionIds: ["permission-id"] };
      commands.addRolePermission.mockResolvedValue([{ id: "permission-id" }]);

      await controller.addDriverRolePermission(
        currentUser as never,
        command as never
      );

      expect(command).toMatchObject({ currentUser });
      expect(commands.addRolePermission).toHaveBeenCalledWith(command);
    });
  });
});
