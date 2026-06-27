import { ConfigurationsController } from "./configurations.controller";

const currentUser = {
  id: "admin-id",
  role: { id: "role-id", key: "super_admin", name: "Super Admin" },
  permissions: ["manage-configurations"],
};

describe("ConfigurationsController", () => {
  const commands = {
    createConfiguration: jest.fn(),
    updateConfiguration: jest.fn(),
    archiveConfiguration: jest.fn(),
    deleteConfiguration: jest.fn(),
    restoreConfiguration: jest.fn(),
  };
  const queries = {
    getConfiguration: jest.fn(),
    getConfigurations: jest.fn(),
    getPublicConfiguration: jest.fn(),
    getArchivedConfigurations: jest.fn(),
  };
  let controller: ConfigurationsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ConfigurationsController(commands as never, queries as never);
  });

  it("returns public configuration without requiring a user", async () => {
    const query = { top: 1 };
    const response = {
      companyName: "VANTAGE",
      supportPhone: "+251 913 922 700",
      primaryCtaHref: "#apply",
    };
    queries.getPublicConfiguration.mockResolvedValue(response);

    await expect(controller.getPublicConfiguration(query as never)).resolves.toEqual(
      response
    );
    expect(queries.getPublicConfiguration).toHaveBeenCalledWith(query);
  });

  it("injects current user when updating configuration", async () => {
    const command = {
      id: "configuration-id",
      companyName: "VANTAGE",
      supportEmail: "admin@vantagefleet.com",
    };
    commands.updateConfiguration.mockResolvedValue({ id: command.id });

    await controller.updateConfiguration(currentUser as never, command as never);

    expect(command).toMatchObject({ currentUser });
    expect(commands.updateConfiguration).toHaveBeenCalledWith(command);
  });
});
