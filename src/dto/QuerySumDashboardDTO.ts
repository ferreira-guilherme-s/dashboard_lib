import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuerySumDashboardDTO {
  @IsArray()
  @IsNotEmpty()
  fields: string[];

  @IsString()
  @IsNotEmpty()
  table: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsArray()
  joins?: string[];

  @IsNotEmpty()
  @IsArray()
  columnsToSum: string[];
}
