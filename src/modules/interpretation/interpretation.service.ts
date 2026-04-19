import { Injectable } from '@nestjs/common';
import { FactService } from '../fact/fact.service';
import { InterpretationRequestDto } from './dto/interpretation-request.dto';
import { RuleService } from '../rule/rule.service';

@Injectable()
export class InterpretationService {
  constructor(
    private readonly factService: FactService,
    private readonly ruleService: RuleService,
  ) {}

  public async interpretate(request: InterpretationRequestDto) {
    try {
      const normalized = this.factService.normalizeRequest(request);
      return this.ruleService.evaluateFacts(normalized);
    } catch (err) {
      throw err;
    }
  }
}
