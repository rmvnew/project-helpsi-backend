import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";



export class SchedulingFilter extends FilterPagination {

    @ApiProperty({ required: false })
    start_time: Date;

    @ApiProperty({ required: false })
    end_time: Date;

    @ApiProperty({ required: false })
    patient_id: string;

    @ApiProperty({ required: false })
    psychologist_id: string;

    @ApiProperty({ required: false, default: 'DATE', enum: ['DATE'] })
    orderBy: string = 'DATE'
}