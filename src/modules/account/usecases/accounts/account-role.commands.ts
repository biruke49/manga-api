import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { AccountRoleEntity } from "@account/models/accounts/account-role.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CreateAccountRoleCommand {
  accountId: string;
  roleId: string;
  currentUser?: UserInfo;
  static fromCommand(
    createAccountRole: CreateAccountRoleCommand
  ): AccountRoleEntity {
    const accountRole = new AccountRoleEntity();
    accountRole.accountId = createAccountRole.accountId;
    accountRole.roleId = createAccountRole.roleId;
    return accountRole;
  }
}
export class CreateAccountRolesCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  roles: string[];
  currentUser?: UserInfo;
}
export class UpdateAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
  static fromCommand(
    updateAccountRole: UpdateAccountRoleCommand
  ): AccountRoleEntity {
    const accountRole = new AccountRoleEntity();
    accountRole.id = updateAccountRole.id;
    accountRole.accountId = updateAccountRole.accountId;
    accountRole.roleId = updateAccountRole.roleId;
    return accountRole;
  }
}
export class DeleteAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  currentUser: UserInfo;
}
export class ArchiveAccountRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
