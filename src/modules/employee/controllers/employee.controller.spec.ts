import { Test, TestingModule } from "@nestjs/testing";
import { EmployeeController } from "./employee.controller";
import { EmployeeCommands } from "../usecases/employees/employee.usecase.commands";
import { EmployeeQuery } from "../usecases/employees/employee.usecase.queries";
import { FileManagerService } from "@libs/common/file-manager";
import { CreateEmployeeCommand } from "../usecases/employees/employee.commands";
import { EmployeeResponse } from "../usecases/employees/employee.response";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { CredentialType, Gender } from "@libs/common/enums";

describe("EmployeeController", () => {
  let controller: EmployeeController;
  let employeeCommands: EmployeeCommands;

  const mockEmployeeCommands = {
    createEmployee: jest.fn(),
  };

  const mockEmployeeQuery = {};
  const mockFileManagerService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeCommands,
          useValue: mockEmployeeCommands,
        },
        {
          provide: EmployeeQuery,
          useValue: mockEmployeeQuery,
        },
        {
          provide: FileManagerService,
          useValue: mockFileManagerService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    employeeCommands = module.get<EmployeeCommands>(EmployeeCommands);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createEmployee", () => {
    it("should create an employee successfully", async () => {
      // Arrange
      const userInfo: UserInfo = {
        id: "user-uuid",
        email: "admin@example.com",
        name: "Admin User",
        phoneNumber: "+251911000000",
        role: {
          id: "role-uuid",
          name: "Admin",
          key: "admin",
        },
        permissions: [],
        type: CredentialType.Employee,
      };

      const createCommand: CreateEmployeeCommand = {
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "+251911223344",
        gender: Gender.Male,
        address: {
          country: "Ethiopia",
          city: "Addis Ababa",
          woreda: "01",
          houseNumber: "123",
          commonName: "Bole",
        },
        emergencyContact: {
          name: "Jane Doe",
          phoneNumber: "+251911556677",
          email: "jane.doe@example.com",
          city: "Addis Ababa",
          state: "Addis Ababa",
          zip: "1000",
          relationship: "Spouse",
        },
        currentUser: null, // This will be set by the controller
      };

      const expectedResponse: EmployeeResponse = {
        id: "employee-uuid",
        name: createCommand.name,
        email: createCommand.email,
        phoneNumber: createCommand.phoneNumber,
        gender: createCommand.gender,
        enabled: true,
        profileImageFilename: null,
        address: createCommand.address,
        emergencyContact: createCommand.emergencyContact,
        archiveReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        minioProfileImage: null,
      };

      mockEmployeeCommands.createEmployee.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createEmployee(userInfo, createCommand);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(createCommand.currentUser).toEqual(userInfo); // Verify currentUser was injected
      expect(employeeCommands.createEmployee).toHaveBeenCalledWith(
        createCommand
      );
      expect(employeeCommands.createEmployee).toHaveBeenCalledTimes(1);
    });
  });
});
