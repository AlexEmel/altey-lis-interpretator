import { Injectable } from '@nestjs/common';
import { IRuleFacts } from '../fact/interfaces/fact.interface';
import * as rulesJson from './resources/rules.json';
import { IFactIndex, IRule } from './interfaces/rule.interface';

@Injectable()
export class RuleService {
  private readonly RULES: IRule[];

  constructor() {
    this.RULES = rulesJson as IRule[];
  }

  public processFacts(facts: IRuleFacts) {
    try {
      this.getFactsDeps(facts);
    } catch (err) {
      throw err;
    }
  }

  private getFactsDeps(facts: IRuleFacts): IFactIndex {
    try {
      const index = {
        availablePanels: new Set<string>(),
        availableTests: new Set<string>(),
      };

      for (const panel in facts.obs) {
        index.availablePanels.add(panel);
        for (const test in facts.obs[panel]) {
          index.availableTests.add(`${panel}.${test}`);
        }
      }
      
      return index;
    } catch (err) {
      throw err;
    }
  }
}
