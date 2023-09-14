import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";



export class UnavailableFilter extends FilterPagination {


    @ApiProperty({ required: false, description: '### Data inicial da pesquisa' })
    start_time?: Date;

    @ApiProperty({ required: false, description: '### Data final da pesquisa' })
    end_time?: Date;

    @ApiProperty({ required: false, description: '### Nome do Psicólogo' })
    psychologist_name?: string

    @ApiProperty({ required: false, default: 'DATE', enum: ['DATE', 'NAME'] })
    orderBy: string = 'DATE'

}