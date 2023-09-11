import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Scheduling } from './entities/scheduling.entity';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scheduling, UserEntity])
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService]
})
export class SchedulingModule { }
