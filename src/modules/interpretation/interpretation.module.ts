import { Module } from "@nestjs/common";
import { InterpretationController } from "./interpretation.controller";
import { InterpretationService } from "./interpretation.service";
import { FactModule } from "../fact/fact.module";
import { RuleModule } from "../rule/rule.module";

@Module({
  imports: [FactModule, RuleModule],
  controllers: [InterpretationController],
  providers: [InterpretationService]
})
export class InterpretationModule {}