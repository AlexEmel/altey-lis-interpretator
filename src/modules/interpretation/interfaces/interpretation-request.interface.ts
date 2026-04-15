import { EObservationTestType, ESex, ESystemType } from '../enums/request.enum';

interface IRequestSource {
  system: {
    id: string;
    type: ESystemType;
    name: string;
  };
  organisation: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export interface IPatientInfo {
  id: string;
  sex: ESex;
  birthDate: string | null;
}

export interface IObservationRefence {
  refLow: number | null;
  refHigh: number | null;
  refText: string | null;
}

export interface IObservationTest {
  code: string;
  name: string;
  type: EObservationTestType;
  value: string;
  ref: IObservationRefence | null;
}

export interface IObservationPanel {
  panelCode: string;
  panelName: string;
  observations: IObservationTest[];
}

export interface IInterpretationRequest {
  patient: IPatientInfo;
  observations: IObservationPanel[];
  clinicalContext: {};
}

export interface IInterpretationRequesEnriched extends IInterpretationRequest {
  source: IRequestSource;
}
