import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TObservationTestType } from 'src/modules/interfaces/domain.types';
import { IInterpretationRequest } from 'src/modules/interfaces/request.interface';
import { ESex } from '../enums/request.enum';

class PatientInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: ESex })
  @IsEnum(ESex)
  sex: ESex;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  birthDate: string | null;
}

class ObservationReferenceDto {
  @ApiProperty({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  refLow: number | null;

  @ApiProperty({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  refHigh: number | null;

  @ApiProperty({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  refText: string | null;
}

class ObservationTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: ['range', 'qual', 'text'] })
  @IsIn(['range', 'qual', 'text'])
  type: TObservationTestType;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ type: () => ObservationReferenceDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ObservationReferenceDto)
  ref: ObservationReferenceDto | null;
}

class ObservationPanelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => ObservationTestDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObservationTestDto)
  observations: ObservationTestDto[];
}

export class InterpretationRequestDto implements IInterpretationRequest {
  @ApiProperty({ type: () => PatientInfoDto })
  @ValidateNested()
  @Type(() => PatientInfoDto)
  patient: PatientInfoDto;

  @ApiProperty({ type: () => ObservationPanelDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObservationPanelDto)
  observations: ObservationPanelDto[];

  @ApiProperty({
    type: Object,
    description: 'Free-form clinical context object',
    additionalProperties: true,
  })
  @IsObject()
  clinicalContext: Record<string, unknown>;
}
