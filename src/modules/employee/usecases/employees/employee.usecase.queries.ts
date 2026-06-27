import { CollectionQuery } from "@libs/collection-query/collection-query";
import { FilterOperators } from "@libs/collection-query/filter_operators";
import { QueryConstructor } from "@libs/collection-query/query-constructor";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmployeeEntity } from "@employee/models/employees/employee.entity";
import { Repository } from "typeorm";
import { EmployeeResponse } from "./employee.response";
import { GroupByStatusResponse } from "@libs/common/count-by";
import { FileManagerService } from "@libs/common/file-manager";
@Injectable()
export class EmployeeQuery {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    private fileManagerService: FileManagerService
  ) {}
  async getEmployee(
    id: string,
    relations = [],
    withDeleted = false
  ): Promise<EmployeeResponse> {
    const employee = await this.employeeRepository.findOne({
      where: { id: id },
      relations,
      withDeleted,
    });
    if (!employee) {
      throw new NotFoundException(`Employee not found.`);
    }
    const response = EmployeeResponse.fromEntity(employee);
    if (response.profileImageFilename) {
      const url = await this.fileManagerService.getFromMinio(
        process.env.MINIO_USER_FOLDER,
        response.profileImageFilename
      );
      response.minioProfileImage = url;
    }
    return response;
  }
  async getEmployees(
    query: CollectionQuery
  ): Promise<DataResponseFormat<EmployeeResponse>> {
    const dataQuery = QueryConstructor.constructQuery<EmployeeEntity>(
      this.employeeRepository,
      query
    );
    const d = new DataResponseFormat<EmployeeResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      // d.data = result.map((entity) => EmployeeResponse.fromEntity(entity));
      d.data = await Promise.all(
        result.map(async (entity) => {
          const response = EmployeeResponse.fromEntity(entity);
          if (response.profileImageFilename) {
            const url = await this.fileManagerService.getFromMinio(
              process.env.MINIO_USER_FOLDER,
              response.profileImageFilename
            );
            response.minioProfileImage = url;
          }
          return response;
        })
      );
      d.count = total;
    }
    return d;
  }
  async getArchivedEmployees(
    query: CollectionQuery
  ): Promise<DataResponseFormat<EmployeeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: "deleted_at",
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<EmployeeEntity>(
      this.employeeRepository,
      query
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<EmployeeResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => EmployeeResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async groupEmployeesByStatus(
    query: CollectionQuery
  ): Promise<GroupByStatusResponse[]> {
    query.select = [];
    query.select.push("enabled as enabled", "COUNT(employees.id)");
    const dataQuery = QueryConstructor.constructQuery<EmployeeEntity>(
      this.employeeRepository,
      query
    );
    const data = await dataQuery.getRawMany();
    const countResponses = [];
    data.map((d) => {
      const countResponse = new GroupByStatusResponse();
      countResponse.status = d.enabled;
      countResponse.count = d.count;
      countResponses.push(countResponse);
    });
    return countResponses;
  }
}
