import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";



export class DiaryFilter extends FilterPagination {

    @ApiProperty({ required: false, default: 'DATE', enum: ['DATE'] })
    orderBy: string = 'DATE'

    @ApiProperty({ required: false })
    user_id?: string

}