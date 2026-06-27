interface Role {
  name: string;
  key: string;
  protected?: boolean;
}
interface Permission {
  name: string;
  key: string;
}
export const Roles: Role[] = [
  {
    name: "Super Admin",
    key: "super_admin",
    protected: true,
  },
  {
    name: "Admin",
    key: "admin",
  },
  {
    name: "Operations",
    key: "operations",
  },
  {
    name: "Support",
    key: "support",
  },
];
export const Permissions: Permission[] = [
  {
    name: "Manage Roles",
    key: "manage-roles",
  },
  {
    name: "Manage Permissions",
    key: "manage-permissions",
  },
  {
    name: "Manage Account Roles",
    key: "manage-account-roles",
  },
  {
    name: "Manage Account Permissions",
    key: "manage-account-permissions",
  },
  {
    name: "Manage Employees",
    key: "manage-employees",
  },
  {
    name: "View Users",
    key: "view-users",
  },
  {
    name: "View Employees",
    key: "view-employees",
  },
  {
    name: "Manage Configurations",
    key: "manage-configurations",
  },
  {
    name: "Manage Activities",
    key: "manage-activities",
  },
  {
    name: "Activate or Block Users",
    key: "activate-or-block-users",
  },
];
