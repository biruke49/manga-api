import { ConfigurationEntity } from "@configurations/models/configuration/configuration.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ConfigurationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  timeout: number;
  @ApiProperty()
  isBeingMaintained: boolean;
  @ApiProperty()
  boldSignExpiryDays: number;
  @ApiProperty()
  isLive: boolean;
  @ApiProperty()
  locationBroadcastInterval: number;
  @ApiProperty()
  gracePeriod: number;
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  supportEmail: string;
  @ApiProperty()
  supportPhone: string;
  @ApiProperty()
  defaultDispatchWindow: string;
  @ApiProperty()
  weeklySummary: boolean;
  @ApiProperty()
  defaultMetaTitle: string;
  @ApiProperty()
  defaultMetaDescription: string;
  @ApiProperty()
  announcement: string;
  @ApiProperty()
  announcementSecondary: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  primaryCtaLabel: string;
  @ApiProperty()
  primaryCtaHref: string;
  @ApiProperty()
  secondaryCtaLabel: string;
  @ApiProperty()
  secondaryCtaHref: string;
  @ApiProperty()
  serviceAreaLabel: string;
  @ApiProperty()
  heroEyebrow: string;
  @ApiProperty()
  heroTitle: string;
  @ApiProperty()
  heroDescription: string;
  @ApiProperty()
  mainNavigationText: string;
  @ApiProperty()
  contactPointsText: string;
  @ApiProperty()
  licensesText: string;
  @ApiProperty()
  processEyebrow: string;
  @ApiProperty()
  processTitle: string;
  @ApiProperty()
  processDescription: string;
  @ApiProperty()
  processStepsText: string;
  @ApiProperty()
  ctaEyebrow: string;
  @ApiProperty()
  ctaTitle: string;
  @ApiProperty()
  ctaDescription: string;
  @ApiProperty()
  aboutEyebrow: string;
  @ApiProperty()
  aboutTitle: string;
  @ApiProperty()
  aboutDescription: string;
  @ApiProperty()
  aboutStoryTitle: string;
  @ApiProperty()
  aboutStoryIntro: string;
  @ApiProperty()
  aboutStoryBodyText: string;
  @ApiProperty()
  aboutNavigationText: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  static fromEntity(
    configurationEntity: ConfigurationEntity
  ): ConfigurationResponse {
    const configurationResponse = new ConfigurationResponse();
    configurationResponse.id = configurationEntity.id;
    configurationResponse.timeout = configurationEntity.timeout;
    configurationResponse.isBeingMaintained =
      configurationEntity.isBeingMaintained;
    configurationResponse.boldSignExpiryDays =
      configurationEntity.boldSignExpiryDays;
    configurationResponse.isLive = configurationEntity.isLive;
    configurationResponse.locationBroadcastInterval =
      configurationEntity.locationBroadcastInterval;
    configurationResponse.gracePeriod = configurationEntity.gracePeriod;
    configurationResponse.companyName = configurationEntity.companyName;
    configurationResponse.supportEmail = configurationEntity.supportEmail;
    configurationResponse.supportPhone = configurationEntity.supportPhone;
    configurationResponse.defaultDispatchWindow =
      configurationEntity.defaultDispatchWindow;
    configurationResponse.weeklySummary = configurationEntity.weeklySummary;
    configurationResponse.defaultMetaTitle =
      configurationEntity.defaultMetaTitle;
    configurationResponse.defaultMetaDescription =
      configurationEntity.defaultMetaDescription;
    configurationResponse.announcement = configurationEntity.announcement;
    configurationResponse.announcementSecondary =
      configurationEntity.announcementSecondary;
    configurationResponse.address = configurationEntity.address;
    configurationResponse.primaryCtaLabel = configurationEntity.primaryCtaLabel;
    configurationResponse.primaryCtaHref = configurationEntity.primaryCtaHref;
    configurationResponse.secondaryCtaLabel = configurationEntity.secondaryCtaLabel;
    configurationResponse.secondaryCtaHref = configurationEntity.secondaryCtaHref;
    configurationResponse.serviceAreaLabel = configurationEntity.serviceAreaLabel;
    configurationResponse.heroEyebrow = configurationEntity.heroEyebrow;
    configurationResponse.heroTitle = configurationEntity.heroTitle;
    configurationResponse.heroDescription = configurationEntity.heroDescription;
    configurationResponse.mainNavigationText = configurationEntity.mainNavigationText;
    configurationResponse.contactPointsText = configurationEntity.contactPointsText;
    configurationResponse.licensesText = configurationEntity.licensesText;
    configurationResponse.processEyebrow = configurationEntity.processEyebrow;
    configurationResponse.processTitle = configurationEntity.processTitle;
    configurationResponse.processDescription = configurationEntity.processDescription;
    configurationResponse.processStepsText = configurationEntity.processStepsText;
    configurationResponse.ctaEyebrow = configurationEntity.ctaEyebrow;
    configurationResponse.ctaTitle = configurationEntity.ctaTitle;
    configurationResponse.ctaDescription = configurationEntity.ctaDescription;
    configurationResponse.aboutEyebrow = configurationEntity.aboutEyebrow;
    configurationResponse.aboutTitle = configurationEntity.aboutTitle;
    configurationResponse.aboutDescription = configurationEntity.aboutDescription;
    configurationResponse.aboutStoryTitle = configurationEntity.aboutStoryTitle;
    configurationResponse.aboutStoryIntro = configurationEntity.aboutStoryIntro;
    configurationResponse.aboutStoryBodyText = configurationEntity.aboutStoryBodyText;
    configurationResponse.aboutNavigationText = configurationEntity.aboutNavigationText;
    configurationResponse.createdBy = configurationEntity.createdBy;
    configurationResponse.updatedBy = configurationEntity.updatedBy;
    configurationResponse.deletedBy = configurationEntity.deletedBy;
    configurationResponse.createdAt = configurationEntity.createdAt;
    configurationResponse.updatedAt = configurationEntity.updatedAt;
    configurationResponse.deletedAt = configurationEntity.deletedAt;
    return configurationResponse;
  }
}
