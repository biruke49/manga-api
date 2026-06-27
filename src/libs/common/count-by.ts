import { ApiProperty } from "@nestjs/swagger";

export class CountByCreatedAtResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  count: number;
}
export class CountEarningsByCreatedAtResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  total: number;
}
export class GroupByStatusResponse {
  @ApiProperty()
  status: string;
  @ApiProperty()
  count: number;
}
export class CountByCategoryResponse {
  @ApiProperty()
  category: string;
  @ApiProperty()
  count: number;
}
export class TransactionTotalResponse {
  @ApiProperty()
  total: number;
}
export class CountByGenderResponse {
  @ApiProperty()
  gender: string;
  @ApiProperty()
  count: number;
}
export class CountByStatusResponse {
  @ApiProperty()
  status: string;
  @ApiProperty()
  count: number;
}
export class CountEarningsByCategoryResponse {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  categoryName: string;
  @ApiProperty()
  total: number;
}
export class GroupByAddressResponse {
  @ApiProperty()
  address: string;
  @ApiProperty()
  count: number;
}
