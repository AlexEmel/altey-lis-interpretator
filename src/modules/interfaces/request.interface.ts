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

interface IPatientInfo {
  id: string;
  sex: ESex;
  birthDate: string | null;
}

interface IObservationRefence {
  refLow: number | null;
  refHigh: number | null;
  refText: string | null;
}

interface IObservationTest {
  id: string;
  type: EObservationTestType;
  value: string;
  ref: IObservationRefence | null;
}

interface IObservationPanel {
  id: string;
  name: string;
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
