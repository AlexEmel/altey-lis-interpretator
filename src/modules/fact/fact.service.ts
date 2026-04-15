import { Injectable } from '@nestjs/common';
import { TPanelAliasDict, TTestAliasDict } from './types/fact.type';
import * as panelDictJson from './resources/panel-dict.json';
import * as testDictJson from './resources/test-dict.json';
import { InterpretationRequestDto } from '../interpretation/dto/interpretation-request.dto';
import { IFact, IRuleFacts } from './interfaces/fact.interface';
import { IObservationTest } from '../interpretation/interfaces/interpretation-request.interface';

@Injectable()
export class FactService {
  private readonly PANEL_DICT: TPanelAliasDict;
  private readonly TEST_DICT: TTestAliasDict;

  constructor() {
    this.PANEL_DICT = panelDictJson;
    this.TEST_DICT = testDictJson;
  }

  public mapFacts(request: InterpretationRequestDto) {
    try {
      const facts: IRuleFacts = {
        obs: {},
        patient: {
          sex: request.patient.sex,
          age: this.getAge(request.patient.birthDate),
        },
        context: request.clinicalContext,
      };

      for (const panel of request.observations) {
        const panelAlias = this.PANEL_DICT[panel.panelCode];

        if (!panelAlias) {
          //log mapping error
          continue;
        }

        if (!facts.obs[panelAlias]) {
          facts.obs[panelAlias] = {};
        }

        for (const observation of panel.observations) {
          const factAlias = this.TEST_DICT[panelAlias][observation.code];

          if (!factAlias) {
            //log mapping error
            continue;
          }

          const fact = this.mapObservationToFact(observation, panel.panelCode);
          facts.obs[panelAlias][factAlias] = fact;
        }
      }

      return facts;
    } catch (err) {
      throw err;
    }
  }

  private getAge(dateOfBirth: string | null): number | null {
    try {
      if (!dateOfBirth) return null;

      const birthDate = new Date(dateOfBirth);
      if (Number.isNaN(birthDate.getTime())) {
        return null;
      }

      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const month = now.getMonth() - birthDate.getMonth();

      if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (err) {
      throw err;
    }
  }

  private mapObservationToFact(
    obs: IObservationTest,
    sourcePanelCode: string,
  ): IFact {
    const fact: IFact = {
      value: obs.value,
      refLow: obs.ref.refLow,
      refHigh: obs.ref.refHigh,
      refText: obs.ref.refText,
      testType: obs.type,
      testName: obs.name,
      sourceTestCode: obs.code,
      sourcePanelCode,
    };

    return fact;
  }
}
