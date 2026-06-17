import { IsString, IsOptional, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PropertyType } from '@prisma/client';

export class CreateApplicationDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsUUID()
  @IsOptional()
  senderId?: string;

  @IsUUID()
  @IsOptional()
  notariusId?: string;

  // Qabul qiluvchi — ism yoki ID
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsUUID()
  @IsOptional()
  receiverId?: string;

  // Mijoz o'zi belgilaydi
  @IsString()
  @IsOptional()
  applicationCode?: string;

  @IsString()
  @IsOptional()
  accessPassword?: string;

  // Mulk
  @IsString()
  propertyName: string;

  @IsString()
  @IsOptional()
  propertyDescription?: string;

  @IsString()
  @IsOptional()
  propertyAddress?: string;

  @IsString()
  @IsOptional()
  cadastralNumber?: string;

  @IsNumber()
  @IsOptional()
  estimatedValue?: number;
}

export class UpdateApplicationStatusDto {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
