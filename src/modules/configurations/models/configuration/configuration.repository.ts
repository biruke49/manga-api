import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseRepository } from "@libs/common/repositories/base.repository";
import { ConfigurationEntity } from "./configuration.entity";

@Injectable()
export class ConfigurationRepository extends BaseRepository<ConfigurationEntity> {
  constructor(
    @InjectRepository(ConfigurationEntity)
    configurationRepository: Repository<ConfigurationEntity>
  ) {
    super(configurationRepository);
  }
}
