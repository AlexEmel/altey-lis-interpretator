import { Module } from "@nestjs/common";
import { FactService } from "./fact.service";

@Module({
  imports: [],
  controllers: [],
  providers: [FactService],
  exports: [FactService],
})
export class FactModule {}