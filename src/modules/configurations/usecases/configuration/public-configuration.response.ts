import { ConfigurationEntity } from "@configurations/models/configuration/configuration.entity";
import { ApiProperty } from "@nestjs/swagger";

export class PublicConfigurationResponse {
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  supportEmail: string;
  @ApiProperty()
  supportPhone: string;
  @ApiProperty()
  defaultDispatchWindow: string;
  @ApiProperty()
  defaultMetaTitle: string;
  @ApiProperty()
  defaultMetaDescription: string;
  @ApiProperty()
  isBeingMaintained: boolean;
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

  static fromEntity(
    configurationEntity: ConfigurationEntity
  ): PublicConfigurationResponse {
    const response = new PublicConfigurationResponse();
    response.companyName = configurationEntity.companyName;
    response.supportEmail = configurationEntity.supportEmail;
    response.supportPhone = configurationEntity.supportPhone;
    response.defaultDispatchWindow = configurationEntity.defaultDispatchWindow;
    response.defaultMetaTitle = configurationEntity.defaultMetaTitle;
    response.defaultMetaDescription = configurationEntity.defaultMetaDescription;
    response.isBeingMaintained = configurationEntity.isBeingMaintained;
    response.announcement = configurationEntity.announcement;
    response.announcementSecondary = configurationEntity.announcementSecondary;
    response.address = configurationEntity.address;
    response.primaryCtaLabel = configurationEntity.primaryCtaLabel;
    response.primaryCtaHref = configurationEntity.primaryCtaHref;
    response.secondaryCtaLabel = configurationEntity.secondaryCtaLabel;
    response.secondaryCtaHref = configurationEntity.secondaryCtaHref;
    response.serviceAreaLabel = configurationEntity.serviceAreaLabel;
    response.heroEyebrow = configurationEntity.heroEyebrow;
    response.heroTitle = configurationEntity.heroTitle;
    response.heroDescription = configurationEntity.heroDescription;
    response.mainNavigationText = configurationEntity.mainNavigationText;
    response.contactPointsText = configurationEntity.contactPointsText;
    response.licensesText = configurationEntity.licensesText;
    response.processEyebrow = configurationEntity.processEyebrow;
    response.processTitle = configurationEntity.processTitle;
    response.processDescription = configurationEntity.processDescription;
    response.processStepsText = configurationEntity.processStepsText;
    response.ctaEyebrow = configurationEntity.ctaEyebrow;
    response.ctaTitle = configurationEntity.ctaTitle;
    response.ctaDescription = configurationEntity.ctaDescription;
    response.aboutEyebrow = configurationEntity.aboutEyebrow;
    response.aboutTitle = configurationEntity.aboutTitle;
    response.aboutDescription = configurationEntity.aboutDescription;
    response.aboutStoryTitle = configurationEntity.aboutStoryTitle;
    response.aboutStoryIntro = configurationEntity.aboutStoryIntro;
    response.aboutStoryBodyText = configurationEntity.aboutStoryBodyText;
    response.aboutNavigationText = configurationEntity.aboutNavigationText;
    return response;
  }
}
