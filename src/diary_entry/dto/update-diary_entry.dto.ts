import { PartialType } from '@nestjs/swagger';
import { CreateDiaryEntryDto } from './create-diary_entry.dto';

export class UpdateDiaryEntryDto extends PartialType(CreateDiaryEntryDto) {}
