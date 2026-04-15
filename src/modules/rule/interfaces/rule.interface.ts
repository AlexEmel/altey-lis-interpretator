import { TCondition, TOperator } from "../types/rule.type";

export interface IFactCondition {
  fact: string, condition: TCondition
}

export interface IConditionGroup {
  operator: TOperator;
  items: IFactCondition[];
}

export interface IRule {
  id: string;
  title: string;
  panelDependancies: string[];
  factDependancies: string[];
  conditions: IFactCondition | IConditionGroup;
  outcome: {
    code: string;
    summary: string;
  }
}

export interface IFactIndex {
  availablePanels: Set<string>;
  availableTests: Set<string>;
}