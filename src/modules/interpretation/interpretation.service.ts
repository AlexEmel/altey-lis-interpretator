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
      const facts = this.factService.mapFacts(request);
      this.ruleService.processFacts(facts);
      return facts;
    } catch (err) {
      throw err;
    }
  }
}
