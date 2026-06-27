import "reflect-metadata";
import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
import { HttpExceptionFilter } from "@infrastructure/filters/http-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { AppModule } from "./app.module";

import { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin";
import { NestExpressApplication } from "@nestjs/platform-express";

import { text, json, urlencoded } from "express";
import { join } from "path";
import dataSource from "../db/data-source";
declare const module: any;

function getCorsOrigins() {
  const defaultOrigins = [
    "http://86.48.3.184:6002",
    "http://86.48.3.184:6003",
    "http://localhost:6003",
    "http://localhost:6002",
  ];
  const configuredOrigins = process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(new Set([...defaultOrigins, ...(configuredOrigins || [])]));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable JSON body parsing
  app.use(text());
  app.enableCors({
    origin: getCorsOrigins(),
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "x-refresh-token"],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix("api");
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: "none",
    },
    customSiteTitle: "VANTAGE API Documentation",
  };
  const config = new DocumentBuilder()
    .setTitle("VANTAGE API")
    .setDescription("VANTAGE fleet operations API documentation")
    .setVersion("1.0")
    .setContact(
      "VANTAGE",
      process.env.WEBSITE_DOMAIN || "http://localhost:4000",
      "admin@vantagefleet.com"
    )
    .addBearerAuth(
      {
        type: "http",
        schema: "Bearer",
        bearerFormat: "Token",
      } as SecuritySchemeObject,
      "Bearer"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // pipes
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  SwaggerModule.setup("/", app, document, customOptions);
  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  const PORT = process.env.PORT || 3000;
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.useStaticAssets(join(__dirname, "../..", "src/.well-known"), {
    prefix: "/.well-known",
    setHeaders: (res, path, stat) => {
      if (path.endsWith("apple-app-site-association")) {
        res.setHeader("Content-Type", "application/json");
      }
    },
  });
  await app.listen(PORT);
  const date = new Date();
  console.log(`Current Date=> ${date} ${process.env.NODE_ENV}`);
}
bootstrap();
