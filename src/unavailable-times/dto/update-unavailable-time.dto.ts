import { PartialType } from '@nestjs/swagger';
import { CreateUnavailableTimeDto } from './create-unavailable-time.dto';

export class UpdateUnavailableTimeDto extends PartialType(CreateUnavailableTimeDto) {}
