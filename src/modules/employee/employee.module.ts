import { AccountModule } from "@account/account.module";
import { EmployeeEntity } from "@employee/models/employees/employee.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeCommands } from "./usecases/employees/employee.usecase.commands";
import { EmployeeRepository } from "./models/employees/employee.repository";
import { EmployeeController } from "./controllers/employee.controller";
import { Module } from "@nestjs/common";
import { EmployeeQuery } from "./usecases/employees/employee.usecase.queries";

@Module({
  controllers: [EmployeeController],
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity]),
    AccountModule,
  ],
  providers: [EmployeeRepository, EmployeeCommands, EmployeeQuery],
})
export class EmployeeModule {}
