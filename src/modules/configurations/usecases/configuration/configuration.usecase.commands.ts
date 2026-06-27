import { ACTIONS, MODELS } from "@libs/common/constants";
import { ConfigurationRepository } from "@configurations/models/configuration/configuration.repository";
import { FileManagerService } from "@libs/common/file-manager";
import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ArchiveConfigurationCommand,
  CreateConfigurationCommand,
  UpdateConfigurationCommand,
} from "./configuration.commands";
import { ConfigurationResponse } from "./configuration.response";

@Injectable()
export class ConfigurationCommands implements OnModuleInit {
  constructor(
    private configurationRepository: ConfigurationRepository,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService
  ) {}
  onModuleInit() {
    this.seedConfiguration();
  }
  async seedConfiguration(): Promise<void> {
    const existingConfigurations = await this.configurationRepository.getAll(
      [],
      false
    );
    if (!existingConfigurations || existingConfigurations.length <= 0) {
      const configCommand = new CreateConfigurationCommand();
      configCommand.timeout = 30;
      configCommand.isBeingMaintained = false;
      configCommand.boldSignExpiryDays = 2;
      configCommand.isLive = true;
      configCommand.locationBroadcastInterval = 5;
      configCommand.gracePeriod = 3;
      configCommand.companyName = "VANTAGE";
      configCommand.supportEmail = "admin@vantagefleet.com";
      configCommand.supportPhone = "+251 913 922 700";
      configCommand.defaultDispatchWindow = "Same-day review";
      configCommand.weeklySummary = false;
      configCommand.defaultMetaTitle = "VANTAGE | Washington DC Fleet Access";
      configCommand.defaultMetaDescription =
        "Vehicle access for qualified rideshare and delivery drivers in Washington, DC.";
      configCommand.announcement = "DRIVE IN DC WITH VANTAGE";
      configCommand.announcementSecondary = "LOCAL FLEET ACCESS FOR WASHINGTON, DC";
      configCommand.address = "Washington, DC";
      configCommand.primaryCtaLabel = "Apply Now";
      configCommand.primaryCtaHref = "#apply";
      configCommand.secondaryCtaLabel = "View Fleet";
      configCommand.secondaryCtaHref = "#fleet";
      configCommand.serviceAreaLabel = "Serving Washington, DC only.";
      configCommand.heroEyebrow = "Washington, DC Fleet";
      configCommand.heroTitle = "Reliable cars for DC rideshare and delivery drivers.";
      configCommand.heroDescription = "Flexible vehicle access, local onboarding, and practical support for drivers working across Washington, DC.";
      configCommand.mainNavigationText = "Fleet|#fleet\nHow it Works|#how-it-works\nRequirements|#requirements\nDC Area|#coverage\nFAQ|#faq\nContact|#contact";
      configCommand.contactPointsText = "Call|+251 913 922 700|tel:+251913922700\nEmail|admin@vantagefleet.com|mailto:admin@vantagefleet.com\nService Area|Washington, DC";
      configCommand.licensesText = "DC Business|On file\nInsurance|Commercial fleet coverage";
      configCommand.processEyebrow = "How It Works";
      configCommand.processTitle = "A simple path from application to active vehicle.";
      configCommand.processDescription = "VANTAGE keeps onboarding focused on driver eligibility, vehicle fit, pickup timing, and support after handoff.";
      configCommand.processStepsText = "Apply|Share your license, work eligibility, and platform details so we can review fit.\nMatch|We recommend an available vehicle based on your work pattern and DC coverage needs.\nPickup|Complete local onboarding, inspect the car, and get set up for your first shift.\nDrive|Use local support for routine questions, vehicle issues, and renewal planning.";
      configCommand.ctaEyebrow = "Start Driving";
      configCommand.ctaTitle = "Apply for a VANTAGE vehicle in Washington, DC.";
      configCommand.ctaDescription = "Local review, clear requirements, and vehicles positioned for DC rideshare and delivery work.";
      configCommand.aboutEyebrow = "About";
      configCommand.aboutTitle = "Built for drivers working one city well.";
      configCommand.aboutDescription = "A focused Washington, DC fleet operation for rideshare and delivery drivers.";
      configCommand.aboutStoryTitle = "Local fleet access for DC drivers.";
      configCommand.aboutStoryIntro = "VANTAGE supports qualified drivers who need reliable vehicle access for work across Washington, DC.";
      configCommand.aboutStoryBodyText = "The operation is intentionally local. Vehicles, onboarding, and support are designed around the realities of driving in Washington, DC rather than a multi-city marketplace.\nThat focus keeps the experience straightforward: clear requirements, practical vehicle options, and support from a team that knows the area.";
      configCommand.aboutNavigationText = "View Fleet|#fleet\nHow It Works|#how-it-works\nContact|#contact";
      this.createConfiguration(configCommand);
    }
  }
  async createConfiguration(
    command: CreateConfigurationCommand
  ): Promise<ConfigurationResponse> {
    const configurationDomain = CreateConfigurationCommand.fromCommand(command);
    const configuration = await this.configurationRepository.insert(
      configurationDomain
    );
    return ConfigurationResponse.fromEntity(configuration);
  }
  async updateConfiguration(
    command: UpdateConfigurationCommand
  ): Promise<ConfigurationResponse> {
    const configurationDomain = await this.configurationRepository.getById(
      command.id
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found.`);
    }
    const oldPayload = configurationDomain;
    configurationDomain.timeout = command.timeout;
    configurationDomain.isBeingMaintained = command.isBeingMaintained;
    configurationDomain.boldSignExpiryDays = command.boldSignExpiryDays;
    configurationDomain.isLive = command.isLive;
    configurationDomain.locationBroadcastInterval =
      command.locationBroadcastInterval;
    configurationDomain.gracePeriod = command.gracePeriod;
    configurationDomain.companyName = command.companyName;
    configurationDomain.supportEmail = command.supportEmail;
    configurationDomain.supportPhone = command.supportPhone;
    configurationDomain.defaultDispatchWindow = command.defaultDispatchWindow;
    configurationDomain.weeklySummary = command.weeklySummary;
    configurationDomain.defaultMetaTitle = command.defaultMetaTitle;
    configurationDomain.defaultMetaDescription =
      command.defaultMetaDescription;
    configurationDomain.announcement = command.announcement;
    configurationDomain.announcementSecondary = command.announcementSecondary;
    configurationDomain.address = command.address;
    configurationDomain.primaryCtaLabel = command.primaryCtaLabel;
    configurationDomain.primaryCtaHref = command.primaryCtaHref;
    configurationDomain.secondaryCtaLabel = command.secondaryCtaLabel;
    configurationDomain.secondaryCtaHref = command.secondaryCtaHref;
    configurationDomain.serviceAreaLabel = command.serviceAreaLabel;
    configurationDomain.heroEyebrow = command.heroEyebrow;
    configurationDomain.heroTitle = command.heroTitle;
    configurationDomain.heroDescription = command.heroDescription;
    configurationDomain.mainNavigationText = command.mainNavigationText;
    configurationDomain.contactPointsText = command.contactPointsText;
    configurationDomain.licensesText = command.licensesText;
    configurationDomain.processEyebrow = command.processEyebrow;
    configurationDomain.processTitle = command.processTitle;
    configurationDomain.processDescription = command.processDescription;
    configurationDomain.processStepsText = command.processStepsText;
    configurationDomain.ctaEyebrow = command.ctaEyebrow;
    configurationDomain.ctaTitle = command.ctaTitle;
    configurationDomain.ctaDescription = command.ctaDescription;
    configurationDomain.aboutEyebrow = command.aboutEyebrow;
    configurationDomain.aboutTitle = command.aboutTitle;
    configurationDomain.aboutDescription = command.aboutDescription;
    configurationDomain.aboutStoryTitle = command.aboutStoryTitle;
    configurationDomain.aboutStoryIntro = command.aboutStoryIntro;
    configurationDomain.aboutStoryBodyText = command.aboutStoryBodyText;
    configurationDomain.aboutNavigationText = command.aboutNavigationText;
    configurationDomain.updatedBy = command.currentUser.id;
    const configuration = await this.configurationRepository.update(
      configurationDomain.id,
      configurationDomain
    );
    if (configuration) {
      this.eventEmitter.emit("activity-logger.store", {
        modelId: configuration.id,
        modelName: MODELS.CONFIGURATION,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        payload: configuration,
        oldPayload: oldPayload,
      });
    }
    return ConfigurationResponse.fromEntity(configuration);
  }
  async archiveConfiguration(
    command: ArchiveConfigurationCommand
  ): Promise<boolean> {
    const configurationDomain = await this.configurationRepository.getById(
      command.id
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found.`);
    }
    configurationDomain.deletedAt = new Date();
    configurationDomain.deletedBy = command.currentUser.id;
    configurationDomain.archiveReason = command.reason;
    const result = await this.configurationRepository.update(
      configurationDomain.id,
      configurationDomain
    );
    return result ? true : false;
  }
  async restoreConfiguration(id: string): Promise<ConfigurationResponse> {
    const configurationDomain = await this.configurationRepository.getById(
      id,
      [],
      true
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found.`);
    }
    const r = await this.configurationRepository.restore(id);
    if (r) {
      configurationDomain.deletedAt = null;
      configurationDomain.deletedBy = null;
      configurationDomain.archiveReason = null;
      await this.configurationRepository.update(
        configurationDomain.id,
        configurationDomain
      );
    }
    return ConfigurationResponse.fromEntity(configurationDomain);
  }
  async deleteConfiguration(id: string): Promise<boolean> {
    const configurationDomain = await this.configurationRepository.getById(
      id,
      [],
      true
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found.`);
    }
    return await this.configurationRepository.delete(id);
  }
}
