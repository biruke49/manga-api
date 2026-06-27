import { AccountEntity } from "@account/models/accounts/account.entity";
import { Address } from "@libs/common/address";
import { ApiProperty } from "@nestjs/swagger";

export class AccountResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImageFilename?: string;
  @ApiProperty()
  fcmId?: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  static fromEntity(accountEntity: AccountEntity): AccountResponse {
    const accountResponse = new AccountResponse();
    accountResponse.id = accountEntity.id;
    accountResponse.name = accountEntity.name;
    accountResponse.email = accountEntity.email;
    accountResponse.phoneNumber = accountEntity.phoneNumber;
    accountResponse.type = accountEntity.type;
    accountResponse.isActive = accountEntity.isActive;
    accountResponse.gender = accountEntity.gender;
    accountResponse.address = accountEntity.address;
    accountResponse.profileImageFilename = accountEntity.profileImageFilename;
    accountResponse.fcmId = accountEntity.fcmId;
    accountResponse.createdBy = accountEntity.createdBy;
    accountResponse.updatedBy = accountEntity.updatedBy;
    accountResponse.deletedBy = accountEntity.deletedBy;
    accountResponse.createdAt = accountEntity.createdAt;
    accountResponse.updatedAt = accountEntity.updatedAt;
    accountResponse.deletedAt = accountEntity.deletedAt;
    return accountResponse;
  }
}
