import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { AuthController } from "./auth.controller";
import { AuthService } from "@account/auth/services/auth.service";
import { SessionCommands } from "@account/usecases/sessions/session.usecase.commands";
import { SessionQuery } from "@account/usecases/sessions/session.usecase.queries";
import { UserLoginCommand } from "@account/auth/commands/auth.commands";
import { CredentialType } from "@libs/common/enums";

describe("AuthController", () => {
  let controller: AuthController;
  const authService = {
    login: jest.fn(),
    changePassword: jest.fn(),
    updatePassword: jest.fn(),
    updatePasswordApp: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    resetUserPassword: jest.fn(),
    switchRole: jest.fn(),
  };
  const sessionCommand = {
    createSession: jest.fn(),
    deleteSessionByToken: jest.fn(),
    deleteSessionByRefreshToken: jest.fn(),
  };
  const sessionQuery = {
    getSessionByRefreshToken: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(
      authService as unknown as AuthService,
      sessionCommand as unknown as SessionCommands,
      sessionQuery as unknown as SessionQuery
    );
  });

  it("delegates login to AuthService", async () => {
    const command = {
      phoneNumber: "+251913922700",
      password: "12345678",
      type: CredentialType.Employee,
    } as UserLoginCommand;
    const response = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      profile: { id: "account-id" },
    };
    authService.login.mockResolvedValue(response);

    await expect(controller.login(command)).resolves.toEqual(response);
    expect(authService.login).toHaveBeenCalledWith(command);
  });

  it("requires x-refresh-token for refresh", async () => {
    await expect(controller.getRefreshToken({})).rejects.toBeInstanceOf(
      ForbiddenException
    );
  });

  it("rejects refresh tokens that are not in the session store", async () => {
    sessionQuery.getSessionByRefreshToken.mockResolvedValue(null);

    await expect(
      controller.getRefreshToken({ "x-refresh-token": "missing-refresh" })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("returns a new access token when refresh token is valid", async () => {
    process.env.JWT_SECRET = "test-jwt-secret";
    process.env.REFRESH_SECRET_TOKEN = "test-refresh-secret";
    sessionQuery.getSessionByRefreshToken.mockResolvedValue({ id: "session-id" });
    jest.spyOn(jwt, "verify").mockReturnValue({
      id: "account-id",
      email: "admin@vantagefleet.com",
      name: "Admin",
      type: CredentialType.Employee,
      role: { id: "role-id", name: "Admin", key: "super_admin" },
      permissions: ["manage-fleet"],
      phoneNumber: "+251913922700",
    } as never);

    sessionCommand.deleteSessionByRefreshToken.mockResolvedValue(undefined);
    sessionCommand.createSession = jest.fn().mockResolvedValue({ id: "next-session" });

    const response = await controller.getRefreshToken({
      "x-refresh-token": "valid-refresh",
    });

    expect(response.accessToken).toEqual(expect.any(String));
    expect(response.refreshToken).toEqual(expect.any(String));
    expect(sessionQuery.getSessionByRefreshToken).toHaveBeenCalledWith(
      "valid-refresh"
    );
    expect(sessionCommand.deleteSessionByRefreshToken).toHaveBeenCalledWith(
      "valid-refresh"
    );
    expect(sessionCommand.createSession).toHaveBeenCalledWith({
      accountId: "account-id",
      token: response.accessToken,
      refreshToken: response.refreshToken,
    });
  });

  it("logs out by deleting the session for the bearer token", async () => {
    sessionCommand.deleteSessionByToken.mockResolvedValue(true);

    await expect(
      controller.logout({ authorization: "Bearer access-token" })
    ).resolves.toBe(true);

    expect(sessionCommand.deleteSessionByToken).toHaveBeenCalledWith(
      "access-token"
    );
  });

  it("treats malformed logout authorization as an idempotent logout", async () => {
    await expect(controller.logout({ authorization: "bad-token" })).resolves.toBe(
      true
    );

    expect(sessionCommand.deleteSessionByToken).not.toHaveBeenCalled();
  });

  it("scopes update-password to the authenticated user", async () => {
    authService.updatePassword.mockResolvedValue(true);
    const currentUser = {
      id: "account-id",
      phoneNumber: "+251913922700",
      type: CredentialType.Employee,
    };
    const command = {
      phoneNumber: "+251900000000",
      type: "customer",
      password: "NewPassword1",
      confirmPassword: "NewPassword1",
    };

    await expect(
      controller.updatePassword(currentUser as never, command)
    ).resolves.toBe(true);

    expect(command.phoneNumber).toBe(currentUser.phoneNumber);
    expect(command.type).toBe(currentUser.type);
    expect(authService.updatePassword).toHaveBeenCalledWith(command);
  });
});
