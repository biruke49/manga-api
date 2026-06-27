import { Address } from "@libs/common/address";
export type RoleInfo = {
  id: string;
  name: string;
  key: string;
};
// export type PermissionInfo = {
//   //id: string;
//   //name: string;
//   key: string;
// };
export type UserInfo = {
  id: string;
  email?: string;
  name: string;
  role: RoleInfo;
  permissions?: string[];
  gender?: string;
  type: string;
  fcmId?: string;
  profileImageFilename?: string;
  address?: Address;
  phoneNumber?: string;
};
