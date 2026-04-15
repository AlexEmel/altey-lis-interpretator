import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IInterpretationRequest,
  IObservationPanel,
  IObservationRefence,
  IObservationTest,
  IPatientInfo,
} from 'src/modules/interpretation/interfaces/interpretation-request.interface';
import { EObservationTestType, ESex } from '../enums/request.enum';

class PatientInfoDto implements IPatientInfo {
  @ApiProperty({ example: "4b2cb3b1-35f4-435c-a257-a456230fd33b" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: ESex, example: ESex.MALE })
  @IsEnum(ESex)
  sex: ESex;

  @ApiProperty({ nullable: true, example: "1989-06-03T00:00:00.000Z" })
  @IsOptional()
  @IsString()
  birthDate: string | null;
}

class ObservationReferenceDto implements IObservationRefence {
  @ApiProperty({ nullable: true, type: Number, example: 132  })
  @IsOptional()
  @IsNumber()
  refLow: number | null;

  @ApiProperty({ nullable: true, type: Number, example: 180 })
  @IsOptional()
  @IsNumber()
  refHigh: number | null;

  @ApiProperty({ nullable: true, type: String, example: null })
  @IsOptional()
  @IsString()
  refText: string | null;
}

class ObservationTestDto implements IObservationTest {
  @ApiProperty({ description: "FSLI test code", example: "1017128" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: "Test name", example: "Гемоглобин" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: EObservationTestType, example: EObservationTestType.RANGE })
  @IsEnum(EObservationTestType)
  type: EObservationTestType;

  @ApiProperty({ description: "Result value (as string)", example: "152" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ type: () => ObservationReferenceDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ObservationReferenceDto)
  ref: ObservationReferenceDto | null;
}

class ObservationPanelDto implements IObservationPanel {
  @ApiProperty({ description: "FSLI panel code", example: "101" })
  @IsString()
  @IsNotEmpty()
  panelCode: string;

  @ApiProperty({ description: "Panel name", example: "Общий анализ крови" })
  @IsString()
  @IsNotEmpty()
  panelName: string;

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
  clinicalContext: Record<string, unknown>; // TODO
}
