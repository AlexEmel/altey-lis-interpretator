import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RuleService],
  exports: [RuleService],
})
export class RuleModule {}
