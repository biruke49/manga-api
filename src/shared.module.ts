import { FileManagerService } from "@libs/common/file-manager";
import { Module, Global } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "DOCUMENTS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: "documents_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: "EMAIL_CREDENTIAL_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: "email_credential_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [
    FileManagerService,
    AppService,
  ],
  exports: [
    ClientsModule,
    FileManagerService,
    AppService,
  ],
})
export class SharedModule {}
