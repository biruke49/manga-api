import { CommonEntity } from "@libs/common/entities/common.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configurations")
export class ConfigurationEntity extends CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ default: 30 })
  timeout: number;
  @Column({ name: "is_being_maintained", default: false })
  isBeingMaintained: boolean;
  @Column({ name: "bold_sign_expiry_days", default: 2 })
  boldSignExpiryDays: number;
  @Column({ name: "is_live", default: false })
  isLive: boolean;
  @Column({ name: "location_broadcast_interval", default: 5 })
  locationBroadcastInterval: number;
  @Column({ name: "grace_period", default: 3 })
  gracePeriod: number;

  @Column({ name: "company_name", nullable: true, default: "VANTAGE" })
  companyName: string;

  @Column({
    name: "support_email",
    nullable: true,
    default: "admin@vantagefleet.com",
  })
  supportEmail: string;

  @Column({
    name: "support_phone",
    nullable: true,
    default: "+251 913 922 700",
  })
  supportPhone: string;

  @Column({
    name: "default_dispatch_window",
    nullable: true,
    default: "Same-day review",
  })
  defaultDispatchWindow: string;

  @Column({ name: "weekly_summary", default: false })
  weeklySummary: boolean;

  @Column({
    name: "default_meta_title",
    nullable: true,
    default: "VANTAGE",
  })
  defaultMetaTitle: string;

  @Column({
    name: "default_meta_description",
    type: "text",
    nullable: true,
    default: "Vehicle access for qualified rideshare and delivery drivers in Washington, DC.",
  })
  defaultMetaDescription: string;

  @Column({ nullable: true, default: "DRIVE IN DC WITH VANTAGE" })
  announcement: string;

  @Column({
    name: "announcement_secondary",
    nullable: true,
    default: "LOCAL FLEET ACCESS FOR WASHINGTON, DC",
  })
  announcementSecondary: string;

  @Column({ nullable: true, default: "Washington, DC" })
  address: string;

  @Column({ name: "primary_cta_label", nullable: true, default: "Apply Now" })
  primaryCtaLabel: string;

  @Column({ name: "primary_cta_href", nullable: true, default: "#apply" })
  primaryCtaHref: string;

  @Column({ name: "secondary_cta_label", nullable: true, default: "View Fleet" })
  secondaryCtaLabel: string;

  @Column({ name: "secondary_cta_href", nullable: true, default: "#fleet" })
  secondaryCtaHref: string;

  @Column({
    name: "service_area_label",
    nullable: true,
    default: "Serving Washington, DC only.",
  })
  serviceAreaLabel: string;

  @Column({ name: "hero_eyebrow", nullable: true, default: "Washington, DC Fleet" })
  heroEyebrow: string;

  @Column({ name: "hero_title", nullable: true, default: "Reliable cars for DC rideshare and delivery drivers." })
  heroTitle: string;

  @Column({
    name: "hero_description",
    type: "text",
    nullable: true,
    default: "Flexible vehicle access, local onboarding, and practical support for drivers working across Washington, DC.",
  })
  heroDescription: string;

  @Column({ name: "main_navigation_text", type: "text", nullable: true, default: "Fleet|#fleet\nHow it Works|#how-it-works\nRequirements|#requirements\nDC Area|#coverage\nFAQ|#faq\nContact|#contact" })
  mainNavigationText: string;

  @Column({ name: "contact_points_text", type: "text", nullable: true, default: "Call|+251 913 922 700|tel:+251913922700\nEmail|admin@vantagefleet.com|mailto:admin@vantagefleet.com\nService Area|Washington, DC" })
  contactPointsText: string;

  @Column({ name: "licenses_text", type: "text", nullable: true, default: "DC Business|On file\nInsurance|Commercial fleet coverage" })
  licensesText: string;

  @Column({ name: "process_eyebrow", nullable: true, default: "How It Works" })
  processEyebrow: string;

  @Column({
    name: "process_title",
    nullable: true,
    default: "A simple path from application to active vehicle.",
  })
  processTitle: string;

  @Column({
    name: "process_description",
    type: "text",
    nullable: true,
    default: "VANTAGE keeps onboarding focused on driver eligibility, vehicle fit, pickup timing, and support after handoff.",
  })
  processDescription: string;

  @Column({
    name: "process_steps_text",
    type: "text",
    nullable: true,
    default: "Apply|Share your license, work eligibility, and platform details so we can review fit.\nMatch|We recommend an available vehicle based on your work pattern and DC coverage needs.\nPickup|Complete local onboarding, inspect the car, and get set up for your first shift.\nDrive|Use local support for routine questions, vehicle issues, and renewal planning.",
  })
  processStepsText: string;

  @Column({ name: "cta_eyebrow", nullable: true, default: "Start Driving" })
  ctaEyebrow: string;

  @Column({
    name: "cta_title",
    type: "text",
    nullable: true,
    default: "Apply for a VANTAGE vehicle in Washington, DC.",
  })
  ctaTitle: string;

  @Column({
    name: "cta_description",
    type: "text",
    nullable: true,
    default: "Local review, clear requirements, and vehicles positioned for DC rideshare and delivery work.",
  })
  ctaDescription: string;

  @Column({ name: "about_eyebrow", nullable: true, default: "About" })
  aboutEyebrow: string;

  @Column({ name: "about_title", nullable: true, default: "Built for drivers working one city well." })
  aboutTitle: string;

  @Column({
    name: "about_description",
    type: "text",
    nullable: true,
    default: "A focused Washington, DC fleet operation for rideshare and delivery drivers.",
  })
  aboutDescription: string;

  @Column({
    name: "about_story_title",
    nullable: true,
    default: "Local fleet access for DC drivers.",
  })
  aboutStoryTitle: string;

  @Column({
    name: "about_story_intro",
    type: "text",
    nullable: true,
    default: "VANTAGE supports qualified drivers who need reliable vehicle access for work across Washington, DC.",
  })
  aboutStoryIntro: string;

  @Column({
    name: "about_story_body_text",
    type: "text",
    nullable: true,
    default: "The operation is intentionally local. Vehicles, onboarding, and support are designed around the realities of driving in Washington, DC rather than a multi-city marketplace.\nThat focus keeps the experience straightforward: clear requirements, practical vehicle options, and support from a team that knows the area.",
  })
  aboutStoryBodyText: string;

  @Column({
    name: "about_navigation_text",
    type: "text",
    nullable: true,
    default: "View Fleet|#fleet\nHow It Works|#how-it-works\nContact|#contact",
  })
  aboutNavigationText: string;
}
