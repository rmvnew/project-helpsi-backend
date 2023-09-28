import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";
export class FilterUser extends FilterPagination {


    @ApiProperty({ required: false })
    user_name: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';




}