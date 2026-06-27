import { ActivityEntity } from "@activity-logger/models/activities/activity.entity";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty } from "@nestjs/swagger";
export class ActivityResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  modelId: string;
  @ApiProperty()
  modelName: string;
  @ApiProperty()
  userId?: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  ip?: string;
  @ApiProperty()
  oldPayload?: any;
  @ApiProperty()
  payload?: any;
  @ApiProperty()
  user: UserInfo;
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
  static fromEntity(activityEntity: ActivityEntity): ActivityResponse {
    const activityResponse = new ActivityResponse();
    activityResponse.id = activityEntity.id;
    activityResponse.userId = activityEntity.userId;
    activityResponse.user = activityEntity.user;
    activityResponse.modelId = activityEntity.modelId;
    activityResponse.modelName = activityEntity.modelName;
    activityResponse.ip = activityEntity.ip;
    activityResponse.action = activityEntity.action;
    activityResponse.oldPayload = activityEntity.oldPayload;
    activityResponse.payload = activityEntity.payload;
    activityResponse.createdBy = activityEntity.createdBy;
    activityResponse.updatedBy = activityEntity.updatedBy;
    activityResponse.deletedBy = activityEntity.deletedBy;
    activityResponse.createdAt = activityEntity.createdAt;
    activityResponse.updatedAt = activityEntity.updatedAt;
    activityResponse.deletedAt = activityEntity.deletedAt;
    return activityResponse;
  }
}
