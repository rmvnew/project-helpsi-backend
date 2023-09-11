import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';

@Module({
  controllers: [IaController],
  providers: [IaService]
})
export class IaModule {}
