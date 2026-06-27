import {
  FileManagerService,
  FileManagerHelper,
} from "@libs/common/file-manager";
import { MODELS, ACTIONS } from "@libs/common/constants";
import { CredentialType } from "@libs/common/enums";
import { CreateAccountCommand } from "@account/usecases/accounts/account.commands";
import { AccountCommands } from "@account/usecases/accounts/account.usecase.commands";
import {
  ArchiveEmployeeCommand,
  CreateEmployeeCommand,
  UpdateEmployeeCommand,
} from "./employee.commands";
import { EmployeeRepository } from "@employee/models/employees/employee.repository";
import { EmployeeResponse } from "./employee.response";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { Util } from "@libs/common/util";
import { v4 as uuidv4 } from "uuid";
import { SendSmsCommand } from "@libs/common/notifications/sms.command";
import { AppService } from "app.service";

@Injectable()
export class EmployeeCommands {
  private readonly minioBucketName: string;
  constructor(
    private employeeRepository: EmployeeRepository,
    private readonly accountCommands: AccountCommands,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService,
    private appService: AppService
  ) {
    this.minioBucketName = process.env.MINIO_BUCKET_NAME;
  }
  async createEmployee(
    command: CreateEmployeeCommand
  ): Promise<EmployeeResponse> {
    if (
      await this.employeeRepository.getOneBy(
        "phoneNumber",
        command.phoneNumber,
        [],
        true
      )
    ) {
      throw new BadRequestException(
        `Employee already exist with this phone number`
      );
    }
    if (
      command.email &&
      (await this.employeeRepository.getOneBy("email", command.email, [], true))
    ) {
      throw new BadRequestException(
        `Employee already exist with this email Address`
      );
    }
    const employeeDomain = CreateEmployeeCommand.fromCommand(command);
    const employee = await this.employeeRepository.insert(employeeDomain);
    if (employee) {
      const password = command.password;
      const createAccountCommand = new CreateAccountCommand();
      createAccountCommand.email = command.email;
      createAccountCommand.phoneNumber = command.phoneNumber;
      createAccountCommand.name = command.name;
      createAccountCommand.accountId = employee.id;
      createAccountCommand.type = CredentialType.Employee;
      createAccountCommand.isActive = true;
      createAccountCommand.address = command.address;
      createAccountCommand.gender = command.gender;
      createAccountCommand.password = Util.hashPassword(password);
      const account = await this.accountCommands.createAccount(
        createAccountCommand
      );
      // if (account && account.email) {
      // this.eventEmitter.emit("send.email.credential", {
      //   name: account.name,
      //   email: account.email,
      //   phoneNumber: account.phoneNumber,
      //   password: password,
      //   type: CredentialType.Employee,
      // });
      // this.accountCommands.sendEmailCredential({
      //   name: account.name,
      //   email: account.email,
      //   phoneNumber: account.phoneNumber,
      //   password: password,
      //   type: NotificationFor.DASHBOARD,
      // });
      // }
      if (account && account.phoneNumber) {
        const smsCommand = new SendSmsCommand();
        smsCommand.phone = account.phoneNumber;
        smsCommand.message = `Your YISHAK admin credentials\nPhone number: ${account.phoneNumber}\nPassword: ${password}.`;
        void this.appService.sendGeezSMS(smsCommand).catch((error) => {
          console.error("Failed to send employee credential SMS:", error);
        });
      }

      this.eventEmitter.emit("activity-logger.store", {
        modelId: employee.id,
        modelName: MODELS.USER, // Keep as USER or change to EMPLOYEE if constant exists
        action: ACTIONS.CREATE,
        userId: command.currentUser.id,
        user: command.currentUser,
      });
    }
    return EmployeeResponse.fromEntity(employee);
  }
  async updateEmployee(
    command: UpdateEmployeeCommand
  ): Promise<EmployeeResponse> {
    const employeeDomain = await this.employeeRepository.getById(command.id);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    const oldPayload = employeeDomain;
    employeeDomain.email = command.email;
    employeeDomain.name = command.name;
    employeeDomain.address = command.address;
    employeeDomain.phoneNumber = command.phoneNumber;
    employeeDomain.gender = command.gender;
    employeeDomain.emergencyContact = command.emergencyContact;
    const employee = await this.employeeRepository.update(
      employeeDomain.id,
      employeeDomain
    );
    if (employee) {
      this.eventEmitter.emit("update.account", {
        accountId: employee.id,
        name: employee.name,
        email: employee.email,
        type: CredentialType.Employee,
        phoneNumber: employee.phoneNumber,
        address: employee.address,
        gender: employee.gender,
        profileImage: employee.profileImageFilename,
      });
      this.eventEmitter.emit("activity-logger.store", {
        modelId: employee.id,
        modelName: MODELS.USER,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        oldPayload: oldPayload,
        payload: employee,
      });
    }
    return EmployeeResponse.fromEntity(employee);
  }
  async archiveEmployee(
    command: ArchiveEmployeeCommand
  ): Promise<EmployeeResponse> {
    const employeeDomain = await this.employeeRepository.getById(command.id);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    employeeDomain.deletedAt = new Date();
    employeeDomain.deletedBy = command.currentUser.id;
    employeeDomain.archiveReason = command.reason;
    const result = await this.employeeRepository.update(
      employeeDomain.id,
      employeeDomain
    );
    if (result) {
      this.eventEmitter.emit("account.archived", {
        phoneNumber: employeeDomain.phoneNumber,
        id: employeeDomain.id,
      });
      this.eventEmitter.emit("activity-logger.store", {
        modelId: command.id,
        modelName: MODELS.USER,
        action: ACTIONS.ARCHIVE,
        userId: command.currentUser.id,
        user: command.currentUser,
      });
    }
    return EmployeeResponse.fromEntity(result);
  }
  async restoreEmployee(
    id: string,
    currentUser: UserInfo
  ): Promise<EmployeeResponse> {
    const employeeDomain = await this.employeeRepository.getById(id, [], true);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    const r = await this.employeeRepository.restore(id);
    if (r) {
      employeeDomain.deletedAt = null;
      employeeDomain.deletedBy = null;
      employeeDomain.archiveReason = null;
      await this.employeeRepository.update(employeeDomain.id, employeeDomain);
      this.eventEmitter.emit("account.restored", {
        phoneNumber: employeeDomain.phoneNumber,
        id: employeeDomain.id,
      });
      this.eventEmitter.emit("activity-logger.store", {
        modelId: id,
        modelName: MODELS.USER,
        action: ACTIONS.RESTORE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return EmployeeResponse.fromEntity(employeeDomain);
  }
  async deleteEmployee(id: string, currentUser: UserInfo): Promise<boolean> {
    const employeeDomain = await this.employeeRepository.getById(id, [], true);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    const result = await this.employeeRepository.delete(id);
    if (result) {
      if (employeeDomain.profileImageFilename) {
        // await this.fileManagerService.removeFile(
        //   employeeDomain.profileImageFilename,
        //   FileManagerHelper.UPLOADED_FILES_DESTINATION
        // );
        const deleted = await this.fileManagerService.removeFromMinio(
          this.minioBucketName,
          `${process.env.MINIO_USER_FOLDER}/${employeeDomain.profileImageFilename}`
        );
      }
      this.eventEmitter.emit("account.deleted", {
        phoneNumber: employeeDomain.phoneNumber,
        id: employeeDomain.id,
      });
      this.eventEmitter.emit("activity-logger.store", {
        modelId: id,
        modelName: MODELS.USER,
        action: ACTIONS.DELETE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return result;
  }
  async activateOrBlockEmployee(
    id: string,
    currentUser: UserInfo
  ): Promise<EmployeeResponse> {
    const employeeDomain = await this.employeeRepository.getById(id);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    employeeDomain.enabled = !employeeDomain.enabled;
    const result = await this.employeeRepository.update(
      employeeDomain.id,
      employeeDomain
    );
    if (result) {
      this.eventEmitter.emit("account.activate-or-block", {
        phoneNumber: employeeDomain.phoneNumber,
        id: employeeDomain.id,
      });
      this.eventEmitter.emit("activity-logger.store", {
        modelId: id,
        modelName: MODELS.USER,
        action: employeeDomain.enabled ? ACTIONS.ACTIVATE : ACTIONS.BLOCK,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return EmployeeResponse.fromEntity(result);
  }
  async updateEmployeeProfileImage(id: string, profileImageCommand: any) {
    const employeeDomain = await this.employeeRepository.getById(id, [], true);
    if (!employeeDomain) {
      throw new NotFoundException(`Employee not found.`);
    }
    if (employeeDomain.profileImageFilename && profileImageCommand) {
      // await this.fileManagerService.removeFile(
      //   employeeDomain.profileImage,
      //   FileManagerHelper.UPLOADED_FILES_DESTINATION
      // );
      const deleted = await this.fileManagerService.removeFromMinio(
        this.minioBucketName,
        `${process.env.MINIO_USER_FOLDER}/${employeeDomain.profileImageFilename}`
      );
    }
    if (profileImageCommand) {
      const filename = `${uuidv4()}`;
      const upload = await this.fileManagerService.uploadFileToMinio(
        this.minioBucketName,
        `${process.env.MINIO_USER_FOLDER}/${filename}`,
        profileImageCommand.buffer,
        profileImageCommand.size,
        profileImageCommand.mimetype
      );
      employeeDomain.profileImageFilename = filename;
    }
    const result = await this.employeeRepository.update(
      employeeDomain.id,
      employeeDomain
    );
    if (result) {
      this.eventEmitter.emit("update-account-profile", {
        id: result.id,
        profileImage: result.profileImageFilename,
      });
    }
    const updatedEmployee = await this.employeeRepository.getById(result.id);
    const response = EmployeeResponse.fromEntity(updatedEmployee);
    if (response.profileImageFilename) {
      const url = await this.fileManagerService.getFromMinio(
        process.env.MINIO_USER_FOLDER,
        response.profileImageFilename
      );
      response.minioProfileImage = url;
    }
    return response;
  }
}
