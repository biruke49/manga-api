import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Address } from "@libs/common/address";
import { AccountEntity } from "@account/models/accounts/account.entity";
export class CreateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: "someone@gmail.com",
  })
  email: string;
  @ApiProperty({
    example: "+251911111111",
  })
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  role?: string[];
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImageFilename?: string;
  accountId: string;
  isActive: boolean;
  isIntegration?: boolean; // service account flag
  canLogin?: boolean; // prevent interactive login for integrations
  passwordHash?: string; 
  static fromCommand(command: CreateAccountCommand): AccountEntity {
    const accountDomain = new AccountEntity();
    accountDomain.name = command.name;
    accountDomain.email = command.email.toLowerCase();
    accountDomain.phoneNumber = command.phoneNumber;
    accountDomain.id = command.accountId;
    accountDomain.type = command.type.toLowerCase();
    accountDomain.isActive = command.isActive;
    accountDomain.password = command.password;
    accountDomain.gender = command.gender;
    accountDomain.address = command.address;
    accountDomain.profileImageFilename = command.profileImageFilename;
    accountDomain.username = `${command.type.toLowerCase()}_${command.phoneNumber.toLowerCase()}`;
    return accountDomain;
  }
}
export class UpdateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImageFilename?: string;
}
