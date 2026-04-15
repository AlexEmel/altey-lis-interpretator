import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterpretationService } from './interpretation.service';
import { InterpretationRequestDto } from './dto/interpretation-request.dto';

@Controller('interpretations')
@ApiTags('Interpretation Controller')
export class InterpretationController {
  constructor(private readonly interpretationService: InterpretationService) {}

  @Post()
  @ApiOperation({ summary: 'Request observation interpretation' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async interpretate(@Body() dto: InterpretationRequestDto) {
    return this.interpretationService.interpretate(dto);
  }
}
