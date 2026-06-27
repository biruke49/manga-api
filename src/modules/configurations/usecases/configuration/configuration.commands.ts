import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ConfigurationEntity } from "@configurations/models/configuration/configuration.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GlobalConfigurations {
  @ApiProperty()
  @IsNotEmpty()
  timeout: number = 30;
  @ApiProperty()
  @IsNotEmpty()
  isBeingMaintained: boolean = false;
  @ApiProperty()
  @IsNotEmpty()
  boldSignExpiryDays: number = 2;
  @ApiProperty()
  @IsNotEmpty()
  numberOfDaysAfterExpiry: number = 2;
  @ApiProperty()
  @IsNotEmpty()
  isLive: boolean = true;
}

export class CreateConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  timeout: number;
  @ApiProperty()
  @IsNotEmpty()
  isBeingMaintained: boolean;
  @ApiProperty()
  @IsNotEmpty()
  boldSignExpiryDays: number;
  @ApiProperty()
  @IsNotEmpty()
  isLive: boolean;
  @ApiProperty()
  @IsNotEmpty()
  locationBroadcastInterval: number;
  @ApiProperty()
  @IsNotEmpty()
  gracePeriod: number;
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;
  @ApiProperty()
  @IsNotEmpty()
  supportEmail: string;
  @ApiProperty()
  @IsNotEmpty()
  supportPhone: string;
  @ApiProperty()
  @IsNotEmpty()
  defaultDispatchWindow: string;
  @ApiProperty()
  @IsNotEmpty()
  weeklySummary: boolean;
  @ApiProperty()
  @IsNotEmpty()
  defaultMetaTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  defaultMetaDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  announcement: string;
  @ApiProperty()
  @IsNotEmpty()
  announcementSecondary: string;
  @ApiProperty()
  @IsNotEmpty()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  primaryCtaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  primaryCtaHref: string;
  @ApiProperty()
  @IsNotEmpty()
  secondaryCtaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  secondaryCtaHref: string;
  @ApiProperty()
  @IsNotEmpty()
  serviceAreaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  heroEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  heroTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  heroDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  mainNavigationText: string;
  @ApiProperty()
  @IsNotEmpty()
  contactPointsText: string;
  @ApiProperty()
  @IsNotEmpty()
  licensesText: string;
  @ApiProperty()
  @IsNotEmpty()
  processEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  processTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  processDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  processStepsText: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryIntro: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryBodyText: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutNavigationText: string;

  currentUser: UserInfo;
  static fromCommand(command: CreateConfigurationCommand): ConfigurationEntity {
    const configuration = new ConfigurationEntity();
    configuration.timeout = command.timeout;
    configuration.isBeingMaintained = command.isBeingMaintained;
    configuration.boldSignExpiryDays = command.boldSignExpiryDays;
    configuration.isLive = command.isLive;
    configuration.locationBroadcastInterval = command.locationBroadcastInterval;
    configuration.gracePeriod = command.gracePeriod;
    configuration.companyName = command.companyName;
    configuration.supportEmail = command.supportEmail;
    configuration.supportPhone = command.supportPhone;
    configuration.defaultDispatchWindow = command.defaultDispatchWindow;
    configuration.weeklySummary = command.weeklySummary;
    configuration.defaultMetaTitle = command.defaultMetaTitle;
    configuration.defaultMetaDescription = command.defaultMetaDescription;
    configuration.announcement = command.announcement;
    configuration.announcementSecondary = command.announcementSecondary;
    configuration.address = command.address;
    configuration.primaryCtaLabel = command.primaryCtaLabel;
    configuration.primaryCtaHref = command.primaryCtaHref;
    configuration.secondaryCtaLabel = command.secondaryCtaLabel;
    configuration.secondaryCtaHref = command.secondaryCtaHref;
    configuration.serviceAreaLabel = command.serviceAreaLabel;
    configuration.heroEyebrow = command.heroEyebrow;
    configuration.heroTitle = command.heroTitle;
    configuration.heroDescription = command.heroDescription;
    configuration.mainNavigationText = command.mainNavigationText;
    configuration.contactPointsText = command.contactPointsText;
    configuration.licensesText = command.licensesText;
    configuration.processEyebrow = command.processEyebrow;
    configuration.processTitle = command.processTitle;
    configuration.processDescription = command.processDescription;
    configuration.processStepsText = command.processStepsText;
    configuration.ctaEyebrow = command.ctaEyebrow;
    configuration.ctaTitle = command.ctaTitle;
    configuration.ctaDescription = command.ctaDescription;
    configuration.aboutEyebrow = command.aboutEyebrow;
    configuration.aboutTitle = command.aboutTitle;
    configuration.aboutDescription = command.aboutDescription;
    configuration.aboutStoryTitle = command.aboutStoryTitle;
    configuration.aboutStoryIntro = command.aboutStoryIntro;
    configuration.aboutStoryBodyText = command.aboutStoryBodyText;
    configuration.aboutNavigationText = command.aboutNavigationText;
    return configuration;
  }
}
export class UpdateConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  timeout: number;
  @ApiProperty()
  @IsNotEmpty()
  isBeingMaintained: boolean;
  @ApiProperty()
  @IsNotEmpty()
  boldSignExpiryDays: number;
  @ApiProperty()
  @IsNotEmpty()
  isLive: boolean;
  @ApiProperty()
  @IsNotEmpty()
  locationBroadcastInterval: number;
  @ApiProperty()
  @IsNotEmpty()
  gracePeriod: number;
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;
  @ApiProperty()
  @IsNotEmpty()
  supportEmail: string;
  @ApiProperty()
  @IsNotEmpty()
  supportPhone: string;
  @ApiProperty()
  @IsNotEmpty()
  defaultDispatchWindow: string;
  @ApiProperty()
  @IsNotEmpty()
  weeklySummary: boolean;
  @ApiProperty()
  @IsNotEmpty()
  defaultMetaTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  defaultMetaDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  announcement: string;
  @ApiProperty()
  @IsNotEmpty()
  announcementSecondary: string;
  @ApiProperty()
  @IsNotEmpty()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  primaryCtaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  primaryCtaHref: string;
  @ApiProperty()
  @IsNotEmpty()
  secondaryCtaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  secondaryCtaHref: string;
  @ApiProperty()
  @IsNotEmpty()
  serviceAreaLabel: string;
  @ApiProperty()
  @IsNotEmpty()
  heroEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  heroTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  heroDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  mainNavigationText: string;
  @ApiProperty()
  @IsNotEmpty()
  contactPointsText: string;
  @ApiProperty()
  @IsNotEmpty()
  licensesText: string;
  @ApiProperty()
  @IsNotEmpty()
  processEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  processTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  processDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  processStepsText: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  ctaDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutEyebrow: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryTitle: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryIntro: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutStoryBodyText: string;
  @ApiProperty()
  @IsNotEmpty()
  aboutNavigationText: string;
  currentUser: UserInfo;
  static fromCommand(command: UpdateConfigurationCommand): ConfigurationEntity {
    const configuration = new ConfigurationEntity();
    configuration.id = command.id;
    configuration.timeout = command.timeout;
    configuration.isBeingMaintained = command.isBeingMaintained;
    configuration.boldSignExpiryDays = command.boldSignExpiryDays;
    configuration.isLive = command.isLive;
    configuration.locationBroadcastInterval = command.locationBroadcastInterval;
    configuration.gracePeriod = command.gracePeriod;
    configuration.companyName = command.companyName;
    configuration.supportEmail = command.supportEmail;
    configuration.supportPhone = command.supportPhone;
    configuration.defaultDispatchWindow = command.defaultDispatchWindow;
    configuration.weeklySummary = command.weeklySummary;
    configuration.defaultMetaTitle = command.defaultMetaTitle;
    configuration.defaultMetaDescription = command.defaultMetaDescription;
    configuration.announcement = command.announcement;
    configuration.announcementSecondary = command.announcementSecondary;
    configuration.address = command.address;
    configuration.primaryCtaLabel = command.primaryCtaLabel;
    configuration.primaryCtaHref = command.primaryCtaHref;
    configuration.secondaryCtaLabel = command.secondaryCtaLabel;
    configuration.secondaryCtaHref = command.secondaryCtaHref;
    configuration.serviceAreaLabel = command.serviceAreaLabel;
    configuration.heroEyebrow = command.heroEyebrow;
    configuration.heroTitle = command.heroTitle;
    configuration.heroDescription = command.heroDescription;
    configuration.mainNavigationText = command.mainNavigationText;
    configuration.contactPointsText = command.contactPointsText;
    configuration.licensesText = command.licensesText;
    configuration.processEyebrow = command.processEyebrow;
    configuration.processTitle = command.processTitle;
    configuration.processDescription = command.processDescription;
    configuration.processStepsText = command.processStepsText;
    configuration.ctaEyebrow = command.ctaEyebrow;
    configuration.ctaTitle = command.ctaTitle;
    configuration.ctaDescription = command.ctaDescription;
    configuration.aboutEyebrow = command.aboutEyebrow;
    configuration.aboutTitle = command.aboutTitle;
    configuration.aboutDescription = command.aboutDescription;
    configuration.aboutStoryTitle = command.aboutStoryTitle;
    configuration.aboutStoryIntro = command.aboutStoryIntro;
    configuration.aboutStoryBodyText = command.aboutStoryBodyText;
    configuration.aboutNavigationText = command.aboutNavigationText;
    return configuration;
  }
}
export class ArchiveConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
