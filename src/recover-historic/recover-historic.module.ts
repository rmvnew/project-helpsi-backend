import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricRecover } from './entities/recover-historic.entity';
import { RecoverHistoricController } from './recover-historic.controller';
import { RecoverHistoricService } from './recover-historic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricRecover])
  ],
  controllers: [RecoverHistoricController],
  providers: [RecoverHistoricService],
  exports: [RecoverHistoricService]
})
export class RecoverHistoricModule { }
