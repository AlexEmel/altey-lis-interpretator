import { BadRequestException, Injectable } from '@nestjs/common';
import { IRequestFacts } from '../fact/interfaces/fact.interface';
import {
  IConditionGroup,
  IFactCondition,
  IFactIndex,
  IRule,
  IRuleIndex,
  isGroupCondition,
} from './interfaces/rule.interface';
import * as rulesJson from './resources/rules.json';

@Injectable()
export class RuleService {
  private readonly ruleIndex: IRuleIndex;

  constructor() {
    const rules = rulesJson as IRule[];
    this.ruleIndex = {
      allRules: rules,
      byPanel: this.buildPanelIndex(rules),
      byTest: this.buildTextIndex(rules),
    };
  }

  public evaluateFacts(request: IRequestFacts) {
    try {
      const idx = this.getRequestIndex(request);
      const relevantRules = this.getRelevantTestRules(idx);
      const evaluations = []; // TODO type this
      for (const rule of relevantRules) {
        const evaluation = this.evaluateRule(rule, request);
        if (evaluation) {
          evaluations.push(evaluation);
        }
      }
      return evaluations;
    } catch (err) {
      throw err;
    }
  }

  private evaluateRule(rule: IRule, request: IRequestFacts) {
    try {
      const condition = rule.conditions;
      const isGroup = isGroupCondition(condition);
      let finding: boolean = false;

      if (!isGroup) {
        finding = this.evaluateCondition(request, condition);
      } else {
        finding = this.evaluateGroup(request, condition);
      }

      if (!finding) return false;

      return {
        ruleId: rule.id,
        findings: [condition],
        outcome: rule.outcome,
      };
    } catch (err) {
      throw err;
    }
  }

  private evaluateGroup(facts: IRequestFacts, conditions: IConditionGroup) {
    try {
      const operator = conditions.operator;
      const findings: boolean[] = [];

      for (const item of conditions.items) {
        const finding = this.evaluateCondition(facts, item);

        if (!finding && operator === 'and') return false;

        if (finding && operator === 'or') return true;

        findings.push(finding);
      }

      if (operator === 'and') {
        return findings.every((f) => f);
      }

      if (operator === 'or') {
        return findings.some((f) => f);
      }
    } catch (err) {
      throw err;
    }
  }

  private evaluateCondition(
    request: IRequestFacts,
    condition: IFactCondition,
  ): boolean {
    try {
      const [panel, test, fact] = condition.fact.split('.');
      const target = request.facts[panel][test];

      if (!target) {
        return false;
      }

      return target[fact];
    } catch (err) {
      throw err;
    }
  }

  private getRequestIndex(request: IRequestFacts): IFactIndex {
    try {
      const index = {
        availablePanels: new Set<string>(),
        availableTests: new Set<string>(),
      };

      for (const panel in request.tests) {
        index.availablePanels.add(panel);
        for (const test in request.tests[panel]) {
          index.availableTests.add(`${panel}.${test}`);
        }
      }

      return index;
    } catch (err) {
      throw err;
    }
  }

  private buildPanelIndex(rules: IRule[]): Record<string, IRule[]> {
    try {
      const index: Record<string, IRule[]> = {};

      for (const rule of rules) {
        for (const panel of rule.panelDependencies) {
          if (!index[panel]) {
            index[panel] = [];
          }

          index[panel].push(rule);
        }
      }

      return index;
    } catch (err) {
      throw err;
    }
  }

  private buildTextIndex(rules: IRule[]): Record<string, IRule[]> {
    try {
      const index: Record<string, IRule[]> = {};

      for (const rule of rules) {
        for (const test of rule.testDependencies) {
          if (!index[test]) {
            index[test] = [];
          }

          index[test].push(rule);
        }
      }

      return index;
    } catch (err) {
      throw err;
    }
  }

  private getRelevantTestRules(idx: IFactIndex): Set<IRule> {
    try {
      const relevantRules = new Set<IRule>();
      for (const test of idx.availableTests) {
        const rules = this.ruleIndex.byTest[test];
        if (rules.length > 0) {
          rules.forEach((r) => relevantRules.add(r));
        }
      }
      return relevantRules;
    } catch (err) {
      throw err;
    }
  }
}
