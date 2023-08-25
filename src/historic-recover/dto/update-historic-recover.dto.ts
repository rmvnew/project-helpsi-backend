import { PartialType } from '@nestjs/swagger';
import { CreateHistoricRecoverDto } from './create-historic-recover.dto';

export class UpdateHistoricRecoverDto extends PartialType(CreateHistoricRecoverDto) {}
