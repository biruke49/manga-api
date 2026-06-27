import { ClientProxy } from "@nestjs/microservices";
import { CreateAccountCommand, UpdateAccountCommand } from "./account.commands";
import { AccountRepository } from "@account/models/accounts/account.repository";
import { AccountResponse } from "./account.response";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  ArchiveAccountRoleCommand,
  CreateAccountRoleCommand,
  CreateAccountRolesCommand,
  DeleteAccountRoleCommand,
  UpdateAccountRoleCommand,
} from "./account-role.commands";
import { AccountRoleResponse } from "./account-role.response";
import { AccountRoleEntity } from "@account/models/accounts/account-role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccountPermissionEntity } from "@account/models/accounts/account-permission.entity";
import { AccountPermissionResponse } from "./account-permission.response";
import {
  AddAccountPermissionsCommand,
  ArchiveAccountPermissionCommand,
  CreateAccountPermissionCommand,
  DeleteAccountPermissionCommand,
  UpdateAccountPermissionCommand,
} from "./account-permission.commands";
import { RoleQueries } from "../roles/role.usecase.queries";
import { CollectionQuery } from "@libs/collection-query/collection-query";
import { FilterOperators } from "@libs/collection-query/filter_operators";
import { RoleResponse } from "../roles/role.response";
import { PermissionResponse } from "../permissions/permission.response";
import { PermissionQueries } from "../permissions/permission.usecase.queries";
import { CredentialType, Tables } from "@libs/common/enums";
import { RoleRepository } from "@account/models/roles/role.repository";
import { v4 as uuidv4 } from "uuid";
import { Util } from "@libs/common/util";
import { RoleEntity } from "@account/models/roles/role.entity";
import { SendSmsCommand } from "@libs/common/notifications/sms.command";
import { AppService } from "app.service";
@Injectable()
export class AccountCommands {
  constructor(
    private accountRepository: AccountRepository,
    @InjectRepository(AccountRoleEntity)
    private accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(AccountPermissionEntity)
    private accountPermissionRepository: Repository<AccountPermissionEntity>,
    @Inject("EMAIL_CREDENTIAL_SERVICE")
    private emailServiceClient: ClientProxy,
    private roleQueries: RoleQueries,
    private roleRepository: RoleRepository,
    private permissionQueries: PermissionQueries,
    private appService: AppService
  ) {}
  async createAccount(command: CreateAccountCommand): Promise<AccountResponse> {
    const accountDomain = CreateAccountCommand.fromCommand(command);
    const existingAccount = await this.accountRepository.getOneBy(
      "username",
      accountDomain.username,
      [],
      true
    );
    if (!existingAccount) {
      const account = await this.accountRepository.insert(accountDomain);
      if (account.type !== CredentialType.Employee) {
        let role = await this.roleRepository.getOneBy("key", account.type);
        if (!role) {
          const roleName = `${account.type[0].toUpperCase()}${account.type.slice(
            1,
            account.type.length
          )}`;
          role = await this.roleRepository.insert({
            name: roleName,
            key: account.type,
            protected: true,
          } as RoleEntity);
        }
        const accountRoleCommand: CreateAccountRolesCommand = {
          accountId: account.id,
          roles: [role.id],
        };
        await this.seedAccountRole(accountRoleCommand);
      }
      return AccountResponse.fromEntity(account);
    }
    return AccountResponse.fromEntity(accountDomain);
  }
  @OnEvent("update.account")
  async updateAccount(command: UpdateAccountCommand): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
      [],
      true
    );
    if (accountDomain) {
      accountDomain.name = command.name;
      accountDomain.email = command.email?.toLowerCase();
      accountDomain.phoneNumber = command.phoneNumber;
      accountDomain.username = `${accountDomain.type.toLowerCase()}_${command.phoneNumber.toLowerCase()}`;
      accountDomain.gender = command.gender;
      accountDomain.address = command.address;
      accountDomain.profileImageFilename = command.profileImageFilename
        ? command.profileImageFilename
        : accountDomain.profileImageFilename;
      accountDomain.isActive = command.isActive
        ? command.isActive
        : accountDomain.isActive;
      const account = await this.accountRepository.update(
        accountDomain.id,
        accountDomain
      );
      return AccountResponse.fromEntity(account);
    }
    return null;
  }
  async archiveAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found`);
    }
    return await this.accountRepository.archive(id);
  }
  async restoreAccount(id: string): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(id, [], true);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found`);
    }
    const r = await this.accountRepository.restore(id);
    if (r) {
      accountDomain.deletedAt = null;
    }
    return AccountResponse.fromEntity(accountDomain);
  }
  async deleteAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found`);
    }
    return await this.accountRepository.delete(id);
  }
  @OnEvent("account.deleted")
  async handleDeleteAccount(command: { phoneNumber: string; id: string }) {
    const existingAccount = await this.accountRepository.getById(
      command.id,
      [],
      true
    );
    if (existingAccount) {
      await this.accountRepository.delete(existingAccount.id);
    }
  }
  @OnEvent("account.archived")
  async handleArchiveAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, [], true);
    if (account) {
      account.deletedAt = new Date();
      await this.accountRepository.update(account.id, account);
    }
  }
  @OnEvent("account.restored")
  async handleRestoreAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, [], true);
    if (account) {
      account.deletedAt = null;
      account.deletedBy = null;
      await this.accountRepository.update(account.id, account);
    }
  }
  @OnEvent("account.activate-or-block")
  async activateOrBlockAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, [], true);
    if (account) {
      account.isActive = !account.isActive;
      const status = await this.accountRepository.update(account.id, account);
    }
  }
  async sendAccountCredentials(id: string) {
    const account = await this.accountRepository.getById(id, [], true);
    if (account) {
      const password = Util.generatePassword(8);
      account.password = Util.hashPassword(password);
      const status = await this.accountRepository.update(account.id, account);
      if (status) {
        const smsCommand = new SendSmsCommand();
        smsCommand.phone = account.phoneNumber;
        smsCommand.message = `Your VANTAGE admin credentials\nPhone number: ${account.phoneNumber}\nPassword: ${password}.`;
        await this.appService.sendGeezSMS(smsCommand);
      }
      return true;
    }
    return false;
  }
  @OnEvent("remove.fcm.id")
  async removeFcmId(id: string) {
    const account = await this.accountRepository.getById(id, [], true);
    if (account) {
      account.fcmId = null;
      const status = await this.accountRepository.update(account.id, account);
    }
  }
  @OnEvent("account.create-super-admin")
  async createDefaultSupperAdminAccount(data: any) {
    try {
      const command: CreateAccountCommand = {
        accountId: uuidv4(),
        email: "admin@vantagefleet.com",
        type: CredentialType.Employee,
        name: "Super Admin",
        isActive: true,
        password: Util.hashPassword("12345678"),
        phoneNumber: "+251913922700",
        gender: "male",
      };
      const accountDomain = CreateAccountCommand.fromCommand(command);
      const superAccount = await this.accountRepository.insert(accountDomain);
      const accountRoleCommand: CreateAccountRolesCommand = {
        accountId: superAccount.id,
        roles: [data.roleId],
      };
      await this.seedAccountRole(accountRoleCommand);
    } catch (error) {}
  }
  @OnEvent("send.email.credential")
  sendEmailCredential(command: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    type?: string;
    transportName?: string;
  }) {
    this.emailServiceClient.emit("send-email-credential", command);
  }
  @OnEvent("reset-password")
  sendResetPasswordEmailLink(command: {
    name: string;
    phoneNumber: string;
    url: string;
  }) {
    this.emailServiceClient.emit("reset-password", command);
  }

  //Account Role
  async addAccountRole(
    command: CreateAccountRolesCommand
  ): Promise<RoleResponse[]> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId
    );
    if (!accountDomain) {
      throw new NotFoundException(`Account not found.`);
    }
    accountDomain.accountRoles = [];
    for (const roleId of command.roles) {
      const accountRole = CreateAccountRoleCommand.fromCommand({
        roleId: roleId,
        accountId: command.accountId,
      });
      accountDomain.addAccountRole(accountRole);
      const permissionQuery = new CollectionQuery();
      permissionQuery.filter = [];
      permissionQuery.filter.push([
        {
          field: "roleId",
          operator: FilterOperators.EqualTo,
          value: roleId,
        },
      ]);
      const permissions = await this.roleQueries.getRolePermissions(
        permissionQuery
      );
      const accountPermissionsCommand = new AddAccountPermissionsCommand();
      accountPermissionsCommand.roleId = roleId;
      accountPermissionsCommand.accountId = command.accountId;
      accountPermissionsCommand.permissions = permissions.data.map(
        (permission) => {
          return permission.permissionId;
        }
      );
      await this.addAccountPermission(accountPermissionsCommand);
    }
    const result = await this.accountRepository.save(accountDomain);
    if (!result) return null;
    if (result.accountRoles.length === 0) return [];
    const roleIds = result.accountRoles.map((role) => role.roleId);

    const query = new CollectionQuery();
    query.filter = [
      [
        {
          field: "id",
          operator: FilterOperators.In,
          value: roleIds.join(","),
        },
      ],
    ];
    const permissionResponseData = await this.roleQueries.getRoles(query);
    return permissionResponseData.data;
  }
  async seedAccountRole(
    command: CreateAccountRolesCommand
  ): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
      [Tables.AccountRoles]
    );
    if (accountDomain) {
      accountDomain.accountRoles = [];
      for (const roleId of command.roles) {
        const accountRole = CreateAccountRoleCommand.fromCommand({
          roleId: roleId,
          accountId: command.accountId,
        });
        accountDomain.addAccountRole(accountRole);
        const permissionQuery = new CollectionQuery();
        permissionQuery.filter = [];
        permissionQuery.filter.push([
          {
            field: "roleId",
            operator: FilterOperators.EqualTo,
            value: roleId,
          },
        ]);
        const permissions = await this.roleQueries.getRolePermissions(
          permissionQuery
        );
        const accountPermissionsCommand = new AddAccountPermissionsCommand();
        accountPermissionsCommand.roleId = roleId;
        accountPermissionsCommand.accountId = command.accountId;
        accountPermissionsCommand.permissions = permissions.data.map(
          (permission) => {
            return permission.permissionId;
          }
        );
        await this.addAccountPermission(accountPermissionsCommand);
      }
      const result = await this.accountRepository.save(accountDomain);
      return AccountResponse.fromEntity(result);
    }
    return null;
  }
  async updateAccountRole(
    command: UpdateAccountRoleCommand
  ): Promise<AccountRoleResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId
    );
    if (!accountDomain) {
      throw new NotFoundException(`Account not found.`);
    }
    const oldPayload = accountDomain.accountRoles.find(
      (b) => b.id === command.id
    );
    if (oldPayload) {
      throw new BadRequestException(`Role already assigned to this account`);
    }

    const accountRole = UpdateAccountRoleCommand.fromCommand(command);
    accountDomain.updateAccountRole(accountRole);
    const result = await this.accountRepository.update(
      accountDomain.id,
      accountDomain
    );
    if (!result) return null;

    const response = AccountRoleResponse.fromEntity(
      result.accountRoles.find((accountRole) => accountRole.id === command.id)
    );
    return response;
  }
  async deleteAccountRole(command: DeleteAccountRoleCommand): Promise<boolean> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, accountId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    const result = await this.accountRoleRepository.delete({
      id: accountRole.id,
    });
    return result ? true : false;
  }
  async archiveAccountRole(
    command: ArchiveAccountRoleCommand
  ): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId
    );
    if (!accountDomain) {
      throw new NotFoundException(`Account not found.`);
    }
    const accountRole = accountDomain.accountRoles.find(
      (accountRole) => accountRole.id === command.id
    );
    accountRole.deletedAt = new Date();
    accountRole.deletedBy = command.currentUser.id;
    accountRole.archiveReason = command.reason;
    accountDomain.updateAccountRole(accountRole);
    const result = await this.accountRepository.update(
      accountDomain.id,
      accountDomain
    );

    return result ? true : false;
  }
  async restoreAccountRole(
    command: DeleteAccountRoleCommand
  ): Promise<AccountRoleResponse> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, accountId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    accountRole.deletedAt = null;
    const result = await this.accountRoleRepository.save(accountRole);
    return AccountRoleResponse.fromEntity(result);
  }

  //Account Permission
  async addAccountPermission(
    command: AddAccountPermissionsCommand
  ): Promise<PermissionResponse[]> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
      [Tables.AccountPermissions]
    );
    if (!accountDomain) {
      throw new NotFoundException(`Account not found.`);
    }
    for (const permissionId of command.permissions) {
      const isExist = accountDomain.accountPermissions.find(
        (accountPermission) =>
          accountPermission.permissionId === permissionId &&
          accountPermission.roleId === command.roleId
      );
      if (!isExist) {
        const accountPermission = CreateAccountPermissionCommand.fromCommand({
          permissionId: permissionId,
          accountId: command.accountId,
          roleId: command.roleId,
        });
        accountDomain.addAccountPermission(accountPermission);
      }
    }
    let newPermissions: AccountPermissionEntity[];
    newPermissions = accountDomain.accountPermissions.filter(
      (accountPermission) => {
        if (accountPermission.roleId !== command.roleId) {
          return true;
        }

        return command.permissions.includes(accountPermission.permissionId);
      }
    );
    accountDomain.accountPermissions = newPermissions;
    const result = await this.accountRepository.save(accountDomain);

    if (!result) return null;

    if (result.accountPermissions.length === 0) return [];
    const accountPermissions = result.accountPermissions.map(
      (accountPermission) => accountPermission.permissionId
    );
    const query = new CollectionQuery();
    query.filter = [];
    query.filter.push([
      {
        field: "id",
        operator: FilterOperators.In,
        value: accountPermissions.join(","),
      },
    ]);
    const permissionResponseData = await this.permissionQueries.getPermissions(
      query
    );
    return permissionResponseData.data;
  }
  async updateAccountPermission(
    command: UpdateAccountPermissionCommand
  ): Promise<AccountPermissionResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId
    );
    if (!accountDomain) {
      throw new NotFoundException(`Account not found.`);
    }
    const oldPayload = accountDomain.accountPermissions.find(
      (b) => b.id === command.id
    );
    if (oldPayload) {
      throw new BadRequestException(
        `Permission already assigned to this account`
      );
    }

    const accountPermission =
      UpdateAccountPermissionCommand.fromCommand(command);
    accountDomain.updateAccountPermission(accountPermission);
    const result = await this.accountRepository.update(
      accountDomain.id,
      accountDomain
    );
    if (!result) return null;

    const response = AccountPermissionResponse.fromEntity(
      result.accountPermissions.find(
        (accountPermission) => accountPermission.id === command.id
      )
    );
    return response;
  }
  async deleteAccountPermission(
    command: DeleteAccountPermissionCommand
  ): Promise<boolean> {
    const accountPermission = await this.accountPermissionRepository.find({
      where: { id: command.id },
      withDeleted: true,
    });
    if (!accountPermission[0]) {
      throw new NotFoundException(`Account permission not found`);
    }
    const result = await this.accountPermissionRepository.delete({
      id: command.id,
    });
    return result ? true : false;
  }
  async archiveAccountPermission(
    command: ArchiveAccountPermissionCommand
  ): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId
    );
    if (!accountDomain) {
      throw new NotFoundException(` Account not found.`);
    }
    const accountPermission = accountDomain.accountPermissions.find(
      (accountPermission) => accountPermission.id === command.id
    );
    accountPermission.deletedAt = new Date();
    accountPermission.deletedBy = command.currentUser.id;
    accountPermission.archiveReason = command.reason;
    accountDomain.updateAccountPermission(accountPermission);
    const result = await this.accountRepository.update(
      accountDomain.id,
      accountDomain
    );
    return result ? true : false;
  }
  async restoreAccountPermission(
    command: DeleteAccountPermissionCommand
  ): Promise<AccountPermissionResponse> {
    const accountPermission = await this.accountPermissionRepository.find({
      where: { id: command.id },
      withDeleted: true,
    });
    if (!accountPermission[0]) {
      throw new NotFoundException(`Account permission not found`);
    }
    accountPermission[0].deletedAt = null;
    const result = await this.accountPermissionRepository.save(
      accountPermission[0]
    );
    return AccountPermissionResponse.fromEntity(result);
  }
  @OnEvent("update-account-profile")
  async updateAccountProfile(profileInfo): Promise<void> {
    const accountDomain = await this.accountRepository.getOneBy(
      "accountId",
      profileInfo.id
    );
    if (accountDomain) {
      accountDomain.profileImageFilename = profileInfo.profileImageFilename;
      await this.accountRepository.update(accountDomain.id, accountDomain);
    }
  }
}
