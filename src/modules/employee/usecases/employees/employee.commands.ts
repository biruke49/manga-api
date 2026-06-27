import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { Address } from "@libs/common/address";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Gender } from "@libs/common/enums";
import { EmployeeEntity } from "@employee/models/employees/employee.entity";
import { EmergencyContact } from "@libs/common/contact-person";

export class CreateEmployeeCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: "someone@gmail.com",
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: "+251911111111",
  })
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: "Employee Gender must be either male or female",
  })
  gender: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  emergencyContact: EmergencyContact;
  currentUser: UserInfo;

  static fromCommand(command: CreateEmployeeCommand): EmployeeEntity {
    const employeeDomain = new EmployeeEntity();
    employeeDomain.name = command.name;
    employeeDomain.email = command.email.toLowerCase();
    employeeDomain.phoneNumber = command.phoneNumber;
    employeeDomain.gender = command.gender;
    employeeDomain.address = command.address;
    employeeDomain.emergencyContact = command.emergencyContact;
    return employeeDomain;
  }
}
export class UpdateEmployeeCommand {
  @ApiProperty({
    example: "d02dd06f-2a30-4ed8-a2a0-75c683e3092e",
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: "someone@gmail.com",
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: "+251911111111",
  })
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsEnum(Gender, {
    message: "Employee Gender must be either male or female",
  })
  gender: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  emergencyContact: EmergencyContact;
  currentUser: UserInfo;
}
export class ArchiveEmployeeCommand {
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
