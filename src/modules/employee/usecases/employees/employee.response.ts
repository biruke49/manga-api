import { EmployeeEntity } from "@employee/models/employees/employee.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Address } from "@libs/common/address";
import { EmergencyContact } from "@libs/common/contact-person";

export class EmployeeResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  enabled: boolean;
  @ApiProperty()
  profileImageFilename: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  emergencyContact: EmergencyContact;
  @ApiProperty()
  archiveReason: string;
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
  minioProfileImage: string;
  static fromEntity(employeeEntity: EmployeeEntity): EmployeeResponse {
    const employeeResponse = new EmployeeResponse();
    employeeResponse.id = employeeEntity.id;
    employeeResponse.name = employeeEntity.name;
    employeeResponse.email = employeeEntity.email;
    employeeResponse.phoneNumber = employeeEntity.phoneNumber;
    employeeResponse.gender = employeeEntity.gender;
    employeeResponse.enabled = employeeEntity.enabled;
    employeeResponse.profileImageFilename = employeeEntity.profileImageFilename;
    employeeResponse.address = employeeEntity.address;
    employeeResponse.emergencyContact = employeeEntity.emergencyContact;
    employeeResponse.archiveReason = employeeEntity.archiveReason;
    employeeResponse.createdBy = employeeEntity.createdBy;
    employeeResponse.updatedBy = employeeEntity.updatedBy;
    employeeResponse.deletedBy = employeeEntity.deletedBy;
    employeeResponse.createdAt = employeeEntity.createdAt;
    employeeResponse.updatedAt = employeeEntity.updatedAt;
    employeeResponse.deletedAt = employeeEntity.deletedAt;
    return employeeResponse;
  }
}
