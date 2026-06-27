import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseRepository } from "@libs/common/repositories/base.repository";
import { EmployeeEntity } from "./employee.entity";

@Injectable()
export class EmployeeRepository extends BaseRepository<EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    employeeRepository: Repository<EmployeeEntity>
  ) {
    super(employeeRepository);
  }
}
