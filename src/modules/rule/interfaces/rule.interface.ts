import { TCondition, TOperator } from '../types/rule.type';

export interface IFactCondition {
  fact: string;
}

export interface IConditionGroup {
  operator: TOperator;
  items: IFactCondition[];
}

export interface IRule {
  id: string;
  title: string;
  panelDependencies: string[];
  testDependencies: string[];
  conditions: IFactCondition | IConditionGroup;
  outcome: {
    code: string;
    summary: string;
  };
}

export interface IRuleIndex {
  allRules: IRule[];
  byPanel: Record<string, IRule[]>;
  byTest: Record<string, IRule[]>;
}

export interface IFactIndex {
  availablePanels: Set<string>;
  availableTests: Set<string>;
}

export const isGroupCondition = (
  condition: IFactCondition | IConditionGroup,
): condition is IConditionGroup => {
  return 'items' in condition;
};