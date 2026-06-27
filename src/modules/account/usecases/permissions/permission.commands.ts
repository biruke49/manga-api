import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionEntity } from "@account/models/permissions/permission.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  currentUser: UserInfo;
  static fromCommand(command: CreatePermissionCommand): PermissionEntity {
    const permissionDomain = new PermissionEntity();
    permissionDomain.name = command.name;
    permissionDomain.key = command.key;
    return permissionDomain;
  }
}

export class UpdatePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  currentUser: UserInfo;
}
export class ArchivePermissionCommand {
  @ApiProperty({
    example: "d02dd06f-2a30-4ed8-a2a0-75c683e3092e",
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
