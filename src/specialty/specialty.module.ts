import { Module } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';

@Module({
  controllers: [SpecialtyController],
  providers: [SpecialtyService]
})
export class SpecialtyModule {}
