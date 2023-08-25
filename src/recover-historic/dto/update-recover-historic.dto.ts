import { PartialType } from '@nestjs/swagger';
import { CreateRecoverHistoricDto } from './create-recover-historic.dto';

export class UpdateRecoverHistoricDto extends PartialType(CreateRecoverHistoricDto) {}
