import { PartialType } from '@nestjs/swagger';
import { CreateIaDto } from './create-ia.dto';

export class UpdateIaDto extends PartialType(CreateIaDto) {}
