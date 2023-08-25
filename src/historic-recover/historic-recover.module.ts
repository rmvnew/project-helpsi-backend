import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricRecover } from './entities/historic-recover.entity';
import { HistoricRecoverController } from './historic-recover.controller';
import { HistoricRecoverService } from './historic-recover.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricRecover])
  ],
  controllers: [HistoricRecoverController],
  providers: [HistoricRecoverService],
  exports: [HistoricRecoverService]
})
export class HistoricRecoverModule { }
