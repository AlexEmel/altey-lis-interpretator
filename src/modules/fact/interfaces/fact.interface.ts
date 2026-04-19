import {
  EObservationTestType,
  ESex,
} from 'src/modules/interpretation/enums/request.enum';
import { TFacts } from '../types/fact.type';

export interface ITest {
  value: number | string;
  refLow: number | null;
  refHigh: number | null;
  refText: string | null;
  testName: string;
  testType: EObservationTestType;
  sourcePanelCode: string;
  sourceTestCode: string;
}

export interface IRequestFacts {
  facts: {
    [key: string]: { [key: string]: TFacts };
  };
  tests: {
    [key: string]: { [key: string]: ITest };
  };
  patient: {
    sex: ESex;
    age: number | null;
  };
  context: {};
}
