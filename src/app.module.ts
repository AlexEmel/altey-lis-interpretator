import { Module } from '@nestjs/common';
import { InterpretationModule } from './modules/interpretation/interpretation.module';
import { FactModule } from './modules/fact/fact.module';
import { RuleModule } from './modules/rule/rule.module';

@Module({
  imports: [InterpretationModule, FactModule, RuleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
