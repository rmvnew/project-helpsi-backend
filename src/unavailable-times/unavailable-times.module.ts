import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UnavailableTimes } from './entities/unavailable-time.entity';
import { UnavailableTimesController } from './unavailable-times.controller';
import { UnavailableTimesService } from './unavailable-times.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnavailableTimes, UserEntity])
  ],
  controllers: [UnavailableTimesController],
  providers: [UnavailableTimesService],
  exports: [UnavailableTimesService]
})
export class UnavailableTimesModule { }
