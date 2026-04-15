import {
  EObservationTestType,
  ESex,
} from 'src/modules/interpretation/enums/request.enum';

export interface IFact {
  value: number | string;
  refLow: number | null;
  refHigh: number | null;
  refText: string | null;
  testName: string;
  testType: EObservationTestType;
  sourcePanelCode: string;
  sourceTestCode: string;
}

export interface IRuleFacts {
  obs: {
    [key: string]: { [key: string]: IFact };
  };
  patient: {
    sex: ESex;
    age: number | null;
  };
  context: {};
}
