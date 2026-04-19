import { BadRequestException, Injectable } from '@nestjs/common';
import { TFacts, TPanelAliasDict, TTestAliasDict } from './types/fact.type';
import * as panelDictJson from './resources/panel-dict.json';
import * as testDictJson from './resources/test-dict.json';
import { InterpretationRequestDto } from '../interpretation/dto/interpretation-request.dto';
import { ITest, IRequestFacts } from './interfaces/fact.interface';
import { IObservationTest } from '../interpretation/interfaces/interpretation-request.interface';
import { EObservationTestType } from '../interpretation/enums/request.enum';

@Injectable()
export class FactService {
  private readonly PANEL_DICT: TPanelAliasDict;
  private readonly TEST_DICT: TTestAliasDict;

  constructor() {
    this.PANEL_DICT = panelDictJson;
    this.TEST_DICT = testDictJson;
  }

  public normalizeRequest(request: InterpretationRequestDto) {
    try {
      const normalized: IRequestFacts = {
        facts: {},
        tests: {},
        patient: {
          sex: request.patient.sex,
          age: this.getAge(request.patient.birthDate),
        },
        context: request.clinicalContext,
      };

      for (const panel of request.observations) {
        const panelAlias = this.PANEL_DICT[panel.panelCode];

        if (!panelAlias) {
          throw new BadRequestException(`${panel}: invalid panel code`);
        }

        if (!normalized.tests[panelAlias]) {
          normalized.tests[panelAlias] = {};
        }

        if (!normalized.facts[panelAlias]) {
          normalized.facts[panelAlias] = {};
        }

        for (const observation of panel.observations) {
          const testAlias = this.TEST_DICT[panelAlias][observation.code];

          if (!testAlias) {
            throw new BadRequestException(
              `${observation}: invalid observation code`,
            );
          }

          const test = this.mapObservationToTest(observation, panel.panelCode);
          normalized.tests[panelAlias][testAlias] = test;
          normalized.facts[panelAlias][testAlias] = this.calculateFacts(test);
        }
      }

      return normalized;
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

  private mapObservationToTest(
    obs: IObservationTest,
    sourcePanelCode: string,
  ): ITest {
    try {
      const fact: ITest = {
        value: this.parseTestValue(obs.value, obs.type, obs.name),
        refLow: obs.ref.refLow,
        refHigh: obs.ref.refHigh,
        refText: obs.ref.refText,
        testType: obs.type,
        testName: obs.name,
        sourceTestCode: obs.code,
        sourcePanelCode,
      };

      return fact;
    } catch (err) {
      throw err;
    }
  }

  private parseTestValue(
    value: string,
    type: EObservationTestType,
    testName: string,
  ): number | string {
    try {
      let parsedValue: number | string = value;
      if (type === EObservationTestType.RANGE) {
        parsedValue = Number(value);
        if (isNaN(parsedValue)) {
          throw new BadRequestException(`${testName}: invalid result value`);
        }
      }
      return parsedValue;
    } catch (err) {
      throw err;
    }
  }

  private calculateFacts(test: ITest): TFacts {
    try {
      if (
        test.testType === EObservationTestType.RANGE &&
        typeof test.value === 'number'
      ) {
        return this.calculateRangeTestFacts(
          test.value,
          test.refLow,
          test.refHigh,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  private calculateRangeTestFacts(
    value: number,
    refLow: number | null,
    refHigh: number | null,
  ): TFacts {
    try {
      const facts: TFacts = {
        isNormal: true,
        isPathology: false,
        isLow: false,
        isHigh: false,
      };

      if (refLow) {
        facts.isLow = value < refLow;
      }

      if (refHigh) {
        facts.isHigh = value > refHigh;
      }

      if (facts.isLow || facts.isHigh) {
        facts.isNormal = false;
        facts.isPathology = true;
      }

      return facts;
    } catch (err) {
      throw err;
    }
  }
}
