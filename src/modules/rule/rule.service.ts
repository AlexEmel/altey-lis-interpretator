import { BadRequestException, Injectable } from '@nestjs/common';
import { IRuleFacts } from '../fact/interfaces/fact.interface';
import {
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

  public evaluateFacts(facts: IRuleFacts) {
    try {
      const idx = this.getFactIndex(facts);
      const relevantRules = this.getRelevantTestRules(idx);
      const evaluations = []; // TODO type this
      for (const rule of relevantRules) {
        const evaluation = this.evaluateRule(rule, facts);
        evaluations.push(evaluation);
      }
      return evaluations;
    } catch (err) {
      throw err;
    }
  }

  private evaluateRule(rule: IRule, facts: IRuleFacts) {
    try {
      const condition = rule.conditions;
      const isGroup = isGroupCondition(condition);
      if (!isGroup) {
        const finding = this.evaluateCondition(facts, condition);
        if (!finding) return false;
        return {
          ruleId: rule.id,
          findings: [condition],
          outcome: rule.outcome,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  private evaluateCondition(facts: IRuleFacts, factCondition: IFactCondition) {
    try {
      const factPath = factCondition.fact.split('.');
      const targetTest = facts.obs[factPath[1]][factPath[2]];
      // TODO probably want to use targetTest.type check before evaluation
      if (
        (factCondition.condition === 'ltRefLow' &&
          targetTest.refLow === null) ||
        (factCondition.condition === 'gtRefHigh' && targetTest.refHigh === null)
      ) {
        throw new BadRequestException(); // TODO err text
      }
      if (factPath[3] === 'value') {
        switch (factCondition.condition) {
          case 'ltRefLow':
            return +targetTest.value < targetTest.refLow;
          case 'gtRefHigh':
            return +targetTest.value > targetTest.refHigh;
          default:
            return false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private getFactIndex(facts: IRuleFacts): IFactIndex {
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
