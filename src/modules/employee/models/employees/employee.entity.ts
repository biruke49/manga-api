import { Address } from "@libs/common/address";
import { EmergencyContact } from "@libs/common/contact-person";
import { CommonEntity } from "@libs/common/entities/common.entity";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
@Entity({ name: "employees" })
export class EmployeeEntity extends CommonEntity {
  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Index()
  @Column({ nullable: true })
  email: string;
  @Index()
  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ name: "emergency_contact", type: "jsonb", nullable: true })
  emergencyContact: EmergencyContact;
  @Column({ name: "enabled", default: true })
  enabled: boolean;
  @Column({ name: "profile_image_filename", nullable: true })
  profileImageFilename: string;
  @Column({ type: "jsonb", nullable: true })
  address: Address;
}
