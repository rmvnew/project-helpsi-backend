import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";


export class FilterPsychologists extends FilterPagination {


    @ApiProperty({ required: false })
    user_id: string



}