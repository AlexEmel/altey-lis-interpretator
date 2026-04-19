export type TPanelAliasDict = Record<string, string>;

export type TTestAliasDict = Record<string, Record<string, string>>;

export type TFactKeys = 'isNormal' | 'isPathology' | 'isLow' | 'isHigh';

export type TFacts = Record<TFactKeys, boolean>;
