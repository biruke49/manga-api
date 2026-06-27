import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { RolePermissionEntity } from "@account/models/roles/role-permission.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CreateRolePermissionCommand {
  permissionId: string;
  roleId: string;
  currentUser?: UserInfo;
  static fromCommand(
    createRolePermission: CreateRolePermissionCommand
  ): RolePermissionEntity {
    const accountRole = new RolePermissionEntity();
    accountRole.permissionId = createRolePermission.permissionId;
    accountRole.roleId = createRolePermission.roleId;
    return accountRole;
  }
}
export class CreateRolePermissionsCommand {
  @ApiProperty()
  @IsNotEmpty()
  permissions: string[];
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
}
export class UpdateRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
  static fromCommand(
    updateRolePermission: UpdateRolePermissionCommand
  ): RolePermissionEntity {
    const accountRole = new RolePermissionEntity();
    accountRole.id = updateRolePermission.id;
    accountRole.permissionId = updateRolePermission.permissionId;
    accountRole.roleId = updateRolePermission.roleId;
    return accountRole;
  }
}
export class DeleteRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
}
export class ArchiveRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
